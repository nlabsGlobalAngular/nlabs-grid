# 🎯 Quick Command Reference

## Git Commands

### Initial Setup
```powershell
# Check status
git status

# Add all files
git add .

# Commit with message
git commit -m "feat: initial commit"

# Add remote (if not exists)
git remote add origin https://github.com/nlabsGlobalAngular/nlabs-grid.git

# Update remote (if exists)
git remote set-url origin https://github.com/nlabsGlobalAngular/nlabs-grid.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Quick Push (One Command)
```powershell
# Run the automated script
.\push-to-github.ps1
```

### Manual Step-by-Step
```powershell
cd c:\Users\root\Desktop\angular-datagrid
git add .
git commit -m "feat: initial commit - @nlabs/grid library"
git remote add origin https://github.com/nlabsGlobalAngular/nlabs-grid.git
git branch -M main
git push -u origin main
```

## NPM Commands

### Development
```powershell
# Install dependencies
npm install

# Start dev server
npm start

# Build library
npm run build:lib

# Run tests
npm test

# Run linter
npm run lint
```

### Publishing
```powershell
# Login to NPM
npm login

# Build for production
npm run build:lib

# Publish to NPM
npm publish --access public

# Check version
npm version
```

### Version Management
```powershell
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major

# Custom version
npm version 1.2.3
```

## GitHub Commands

### Repository Setup
```powershell
# Clone your fork
git clone https://github.com/YOUR_USERNAME/nlabs-grid.git

# Add upstream
git remote add upstream https://github.com/nlabsGlobalAngular/nlabs-grid.git

# Fetch upstream
git fetch upstream

# Sync with upstream
git pull upstream main
```

### Branch Management
```powershell
# Create new branch
git checkout -b feature/my-feature

# Switch branch
git checkout main

# List branches
git branch -a

# Delete branch
git branch -d feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature
```

### Commit & Push
```powershell
# Stage specific files
git add file1.ts file2.ts

# Stage all
git add .

# Commit
git commit -m "feat: add new feature"

# Amend last commit
git commit --amend

# Push to remote
git push origin main

# Force push (careful!)
git push -f origin main
```

### Syncing
```powershell
# Pull latest changes
git pull origin main

# Fetch without merge
git fetch origin

# Merge changes
git merge origin/main

# Rebase
git rebase origin/main
```

### Tags & Releases
```powershell
# Create tag
git tag -a v1.0.0 -m "Release v1.0.0"

# Push tags
git push origin --tags

# List tags
git tag -l

# Delete tag
git tag -d v1.0.0
git push origin --delete v1.0.0
```

## CI/CD

### Trigger CI
```powershell
# Any push to main or PR triggers CI
git push origin main
```

### Trigger NPM Publish
```powershell
# Include [publish] in commit message
git commit -m "chore: release v1.0.0 [publish]"
git push origin main
```

## Useful Aliases

Add to your PowerShell profile (`$PROFILE`):

```powershell
# Git aliases
function gst { git status }
function gaa { git add . }
function gcm { param($msg) git commit -m $msg }
function gp { git push }
function gl { git log --oneline --graph --all }
function gco { param($branch) git checkout $branch }

# NPM aliases
function ni { npm install }
function ns { npm start }
function nb { npm run build }
function nt { npm test }
function np { npm publish }

# Quick commands
function qpush {
    git add .
    $msg = Read-Host "Commit message"
    git commit -m $msg
    git push
}
```

Then reload profile:
```powershell
. $PROFILE
```

## Troubleshooting

### Authentication Issues
```powershell
# Use credential helper
git config --global credential.helper store

# Or use SSH instead of HTTPS
git remote set-url origin git@github.com:nlabsGlobalAngular/nlabs-grid.git
```

### Merge Conflicts
```powershell
# Show conflicts
git diff

# Abort merge
git merge --abort

# Keep local changes
git checkout --ours file.ts

# Keep remote changes
git checkout --theirs file.ts
```

### Undo Changes
```powershell
# Undo unstaged changes
git checkout -- file.ts

# Undo staged changes
git reset HEAD file.ts

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

## Links

- **Repository:** https://github.com/nlabsGlobalAngular/nlabs-grid
- **NPM Package:** https://www.npmjs.com/package/@nlabs/grid
- **Issues:** https://github.com/nlabsGlobalAngular/nlabs-grid/issues
- **Actions:** https://github.com/nlabsGlobalAngular/nlabs-grid/actions

---

**💡 Tip:** Run `.\push-to-github.ps1` for automated setup!
