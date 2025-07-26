

### 🛠️ Fixing a Mistake: Working on `main` Instead of a Feature Branch

Instead of creating a new branch to work on, I mistakenly made all my changes directly on the `main` branch of my forked repository. This isn't considered a best practice—especially when collaborating—since `main` should remain clean and reflect the original source.

Once I realized the mistake, I followed these steps to move my commits to a separate feature branch:

---

### ✅ 1. Create a New Branch from the Current `main`

This new branch will include all the commits I made on `main`:

```bash
git checkout -b feature/my-changes
```

Now I’m on a new branch (`feature/my-changes`) that contains all my work so far.

---

### ✅ 2. Reset the `main` Branch to Match the Original Upstream Repo

First, switch back to the `main` branch:

```bash
git checkout main
```

If I hadn’t already, I added the original repo as a remote called `upstream`:

```bash
git remote add upstream https://github.com/ORIGINAL-OWNER/REPO-NAME.git
git fetch upstream
```

Then I reset my local `main` to match the original upstream `main` branch:

```bash
git reset --hard upstream/main
```

> ⚠️ **Warning:** This removes all local commits from `main`. But don’t worry—they still exist in the `feature/my-changes` branch.

---

### ✅ 3. Force Push the Cleaned `main` to My Fork

Since my changes were already pushed to my fork’s `main`, I needed to overwrite it with the clean version:

```bash
git push origin main --force
```

> ⚠️ **Note:** Force-pushing rewrites history, so this should only be done if you're the sole contributor on the forked repo.

---

### ✅ 4. Push the New Feature Branch

Now I pushed my `feature/my-changes` branch (which has all my original work) to GitHub:

```bash
git push origin feature/my-changes
```

---

### ✅ 5. Create a Pull Request from `feature/my-changes`

With `main` now clean and aligned with the original repo, and my changes isolated in the new branch, I opened a pull request from `feature/my-changes`.

---


