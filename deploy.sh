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

# Check if gh-pages branch exists
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
    echo -e "${YELLOW}📝 Creating gh-pages branch...${NC}"
    git checkout --orphan gh-pages
    git rm -rf .
    git commit --allow-empty -m "Initial gh-pages commit"
    git checkout main
fi

# Save current branch name
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${GREEN}📍 Current branch: $CURRENT_BRANCH${NC}"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ Error: You have uncommitted changes. Please commit or stash them first.${NC}"
    exit 1
fi

# Build the project
echo -e "${YELLOW}📦 Building the project...${NC}"
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo -e "${RED}❌ Error: Build failed. No build directory found.${NC}"
    exit 1
fi

# Copy build folder to parent directory (temporary location)
echo -e "${YELLOW}📂 Copying build folder to temporary location...${NC}"
cp -r build ../build-temp

# Switch to gh-pages branch
echo -e "${YELLOW}🔄 Switching to gh-pages branch...${NC}"
git checkout gh-pages

# Remove all existing files except .git
echo -e "${YELLOW}🧹 Cleaning gh-pages branch...${NC}"
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} +

# Copy build contents to current directory
echo -e "${YELLOW}📋 Copying build contents...${NC}"
cp -r ../build-temp/* .
cp -r ../build-temp/.[^.]* . 2>/dev/null || true

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
COMMIT_MESSAGE="Deploy to GitHub Pages - $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MESSAGE"

# Push to gh-pages
echo -e "${YELLOW}📤 Pushing to GitHub Pages...${NC}"
git push origin gh-pages --force

# Switch back to original branch
echo -e "${YELLOW}🔄 Switching back to $CURRENT_BRANCH branch...${NC}"
git checkout $CURRENT_BRANCH

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${GREEN}🌐 Your site will be available at: https://yl3847.github.io/DataAnalysisAgentFrontend/${NC}"
echo -e "${YELLOW}ℹ️  Note: It may take a few minutes for changes to be visible.${NC}"