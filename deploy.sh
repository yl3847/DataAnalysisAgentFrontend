#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting deployment to GitHub Pages...${NC}"

# Check if we're in the right directory (should have package.json)
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Make sure you're in the project root directory.${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Save current branch name
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${GREEN}📍 Current branch: $CURRENT_BRANCH${NC}"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ Error: You have uncommitted changes. Please commit or stash them first.${NC}"
    exit 1
fi

# Make sure we're on main branch for building
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}🔄 Switching to main branch for build...${NC}"
    git checkout main
fi

# Pull latest changes from main
echo -e "${YELLOW}📥 Pulling latest changes from main...${NC}"
git pull origin main

# Build the project from main branch
echo -e "${YELLOW}📦 Building the project from main branch...${NC}"
# Use npx to ensure react-scripts is found
npx react-scripts build

# Check if build was successful
if [ ! -d "build" ]; then
    echo -e "${RED}❌ Error: Build failed. No build directory found.${NC}"
    # Switch back to original branch if we changed
    if [ "$CURRENT_BRANCH" != "main" ]; then
        git checkout $CURRENT_BRANCH
    fi
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Copy build folder to parent directory (temporary location)
echo -e "${YELLOW}📂 Copying build folder to temporary location...${NC}"
rm -rf ../build-temp 2>/dev/null || true
cp -r build ../build-temp

# Check if gh-pages branch exists, create if it doesn't
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
    echo -e "${YELLOW}📝 Creating gh-pages branch...${NC}"
    git checkout --orphan gh-pages
    # Remove all files from the new branch
    git rm -rf . 2>/dev/null || true
    # Create initial commit
    echo "# GitHub Pages" > README.md
    git add README.md
    git commit -m "Initial gh-pages commit"
    git push origin gh-pages
    # Go back to main to continue
    git checkout main
fi

# Switch to gh-pages branch
echo -e "${YELLOW}🔄 Switching to gh-pages branch...${NC}"
git checkout gh-pages

# Pull latest from gh-pages to avoid conflicts
echo -e "${YELLOW}📥 Pulling latest from gh-pages...${NC}"
git pull origin gh-pages 2>/dev/null || true

# Remove all existing files except .git and CNAME (if exists)
echo -e "${YELLOW}🧹 Cleaning gh-pages branch...${NC}"
# Save CNAME if it exists
if [ -f "CNAME" ]; then
    cp CNAME ../CNAME-temp
fi

# Remove everything except .git directory
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} +

# Copy build contents to current directory
echo -e "${YELLOW}📋 Copying build contents to gh-pages branch...${NC}"
cp -r ../build-temp/* .
# Copy hidden files if they exist (like .nojekyll)
cp -r ../build-temp/.[^.]* . 2>/dev/null || true

# Restore CNAME if it existed
if [ -f "../CNAME-temp" ]; then
    mv ../CNAME-temp CNAME
fi

# Create .nojekyll file to bypass Jekyll processing
touch .nojekyll

# Remove temporary build folder
rm -rf ../build-temp

# Add all files to git
echo -e "${YELLOW}📝 Staging changes...${NC}"
git add -A

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}ℹ️  No changes to deploy.${NC}"
    git checkout $CURRENT_BRANCH
    exit 0
fi

# Commit changes
echo -e "${YELLOW}💾 Committing changes...${NC}"
COMMIT_MESSAGE="Deploy to GitHub Pages from main - $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MESSAGE"

# Push to gh-pages
echo -e "${YELLOW}📤 Pushing to GitHub Pages...${NC}"
git push origin gh-pages --force

# Switch back to original branch
echo -e "${YELLOW}🔄 Switching back to $CURRENT_BRANCH branch...${NC}"
git checkout $CURRENT_BRANCH

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${GREEN}🌐 Your site will be available at your GitHub Pages URL${NC}"
echo -e "${YELLOW}ℹ️  Note: It may take a few minutes for changes to be visible.${NC}"

# Clean up any remaining temp files
rm -rf ../build-temp 2>/dev/null || true
rm -f ../CNAME-temp 2>/dev/null || true