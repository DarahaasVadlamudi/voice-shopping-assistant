# Push this project to GitHub

Do these steps in a terminal (PowerShell or Git Bash) from the project folder:  
`C:\Users\Darahaas\voice-shopping-assistant`

## 1. Initialize Git and commit (if not already)

```powershell
cd C:\Users\Darahaas\voice-shopping-assistant

git init
git add .
git commit -m "Initial commit: Voice Command Shopping Assistant"
```

## 2. Create a new repository on GitHub

1. Go to **https://github.com/new**
2. Set **Repository name** (e.g. `voice-shopping-assistant`)
3. Choose **Public**, leave "Add a README" **unchecked**
4. Click **Create repository**

## 3. Connect and push

Replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

Example if your username is `jane` and repo is `voice-shopping-assistant`:

```powershell
git remote add origin https://github.com/jane/voice-shopping-assistant.git
git branch -M main
git push -u origin main
```

If GitHub asks for login, use a **Personal Access Token** as the password (Settings → Developer settings → Personal access tokens on GitHub), or sign in with the GitHub CLI (`gh auth login`) first.

---

**Using GitHub CLI instead:** If you have `gh` installed:

```powershell
gh repo create voice-shopping-assistant --public --source=. --remote=origin --push
```

This creates the repo and pushes in one step.
