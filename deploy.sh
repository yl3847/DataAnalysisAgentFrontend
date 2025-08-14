#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SOURCE_BRANCH=${1:-main}
DEPLOY_BRANCH="gh-pages"
BUILD_DIR="build"
TEMP_BUILD_DIR="../build-temp"

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to cleanup on exit
cleanup() {
    print_status "Cleaning up temporary files..."
    rm -rf "$TEMP_BUILD_DIR" 2>/dev/null || true
    rm -f "../CNAME-temp" 2>/dev/null || true
    
    # Switch back to original branch if we changed
    if [ "$CURRENT_BRANCH" != "$SOURCE_BRANCH" ] && [ -n "$CURRENT_BRANCH" ]; then
        git checkout "$CURRENT_BRANCH" 2>/dev/null || true
    fi
}

# Set trap to cleanup on script exit
trap cleanup EXIT

echo -e "${YELLOW}🚀 Starting deployment to GitHub Pages...${NC}"
print_status "Source branch: $SOURCE_BRANCH"
print_status "Deploy branch: $DEPLOY_BRANCH"

# Check if we're in the right directory (should have package.json)
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the project root directory."
    exit 1
fi

# Check if git repository exists
if [ ! -d ".git" ]; then
    print_error "Not a git repository. Please initialize git first."
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_error "You have uncommitted changes. Please commit or stash them first."
    print_status "You can stash changes with: git stash"
    exit 1
fi

# Save current branch name
CURRENT_BRANCH=$(git branch --show-current)
print_status "Current branch: $CURRENT_BRANCH"

# Check if source branch exists
if ! git show-ref --verify --quiet refs/heads/"$SOURCE_BRANCH"; then
    print_error "Source branch '$SOURCE_BRANCH' does not exist."
    exit 1
fi

# Check if node_modules exists and is up to date
if [ ! -d "node_modules" ] || [ "package-lock.json" -nt "node_modules" ]; then
    print_status "Installing/updating dependencies..."
    if ! npm ci; then
        print_error "Failed to install dependencies."
        exit 1
    fi
fi

# Make sure we're on the source branch for building
if [ "$CURRENT_BRANCH" != "$SOURCE_BRANCH" ]; then
    print_status "Switching to $SOURCE_BRANCH branch for build..."
    if ! git checkout "$SOURCE_BRANCH"; then
        print_error "Failed to switch to $SOURCE_BRANCH branch."
        exit 1
    fi
fi

# Pull latest changes from source branch
print_status "Pulling latest changes from $SOURCE_BRANCH..."
if ! git pull origin "$SOURCE_BRANCH"; then
    print_warning "Failed to pull latest changes. Continuing with current state..."
fi

# Build the project
print_status "Building the project..."
if ! npx react-scripts build; then
    print_error "Build failed."
    exit 1
fi

# Check if build was successful
if [ ! -d "$BUILD_DIR" ]; then
    print_error "Build failed. No build directory found."
    exit 1
fi

print_success "Build successful!"

# Copy build folder to temporary location
print_status "Copying build folder to temporary location..."
rm -rf "$TEMP_BUILD_DIR" 2>/dev/null || true
if ! cp -r "$BUILD_DIR" "$TEMP_BUILD_DIR"; then
    print_error "Failed to copy build folder."
    exit 1
fi

# Check if gh-pages branch exists, create if it doesn't
if ! git show-ref --verify --quiet refs/heads/"$DEPLOY_BRANCH"; then
    print_status "Creating $DEPLOY_BRANCH branch..."
    if ! git checkout --orphan "$DEPLOY_BRANCH"; then
        print_error "Failed to create $DEPLOY_BRANCH branch."
        exit 1
    fi
    # Remove all files from the new branch
    git rm -rf . 2>/dev/null || true
    # Create initial commit
    echo "# GitHub Pages" > README.md
    git add README.md
    if ! git commit -m "Initial $DEPLOY_BRANCH commit"; then
        print_error "Failed to create initial commit."
        exit 1
    fi
    if ! git push origin "$DEPLOY_BRANCH"; then
        print_error "Failed to push initial $DEPLOY_BRANCH branch."
        exit 1
    fi
    # Go back to source branch to continue
    git checkout "$SOURCE_BRANCH"
fi

# Switch to gh-pages branch
print_status "Switching to $DEPLOY_BRANCH branch..."
if ! git checkout "$DEPLOY_BRANCH"; then
    print_error "Failed to switch to $DEPLOY_BRANCH branch."
    exit 1
fi

# Pull latest from gh-pages to avoid conflicts
print_status "Pulling latest from $DEPLOY_BRANCH..."
git pull origin "$DEPLOY_BRANCH" 2>/dev/null || true

# Save CNAME if it exists
if [ -f "CNAME" ]; then
    print_status "Preserving CNAME file..."
    cp CNAME ../CNAME-temp
fi

# Remove all existing files except .git
print_status "Cleaning $DEPLOY_BRANCH branch..."
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} +

# Copy build contents to current directory
print_status "Copying build contents to $DEPLOY_BRANCH branch..."
if ! cp -r "$TEMP_BUILD_DIR"/* .; then
    print_error "Failed to copy build contents."
    exit 1
fi

# Copy hidden files if they exist (like .nojekyll)
cp -r "$TEMP_BUILD_DIR"/.[^.]* . 2>/dev/null || true

# Restore CNAME if it existed
if [ -f "../CNAME-temp" ]; then
    mv ../CNAME-temp CNAME
    print_success "CNAME file restored"
fi

# Create .nojekyll file to bypass Jekyll processing
touch .nojekyll

# Add all files to git
print_status "Staging changes..."
if ! git add -A; then
    print_error "Failed to stage changes."
    exit 1
fi

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to deploy."
    exit 0
fi

# Commit changes
print_status "Committing changes..."
COMMIT_MESSAGE="Deploy to GitHub Pages from $SOURCE_BRANCH - $(date '+%Y-%m-%d %H:%M:%S')"
if ! git commit -m "$COMMIT_MESSAGE"; then
    print_error "Failed to commit changes."
    exit 1
fi

# Push to gh-pages
print_status "Pushing to GitHub Pages..."
if ! git push origin "$DEPLOY_BRANCH" --force; then
    print_error "Failed to push to GitHub Pages."
    exit 1
fi

print_success "Deployment successful!"
print_success "Your site will be available at: https://yl3847.github.io/DataAnalysisAgentFrontend"
print_warning "Note: It may take a few minutes for changes to be visible."