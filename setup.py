#!/usr/bin/env python3
"""
Obsidian + GitHub + Vercel CMS Setup Script
============================================
Interactive setup script to configure your zero-cost CMS.

Requirements: Python 3.8+, Git, Node.js 18+
Usage: python setup.py
"""

import os, sys, json, re, subprocess, shutil
from pathlib import Path
from datetime import date


class C:
    H = "\033[95m"
    B = "\033[94m"
    CY = "\033[96m"
    G = "\033[92m"
    Y = "\033[93m"
    R = "\033[91m"
    E = "\033[0m"
    BD = "\033[1m"


def header(t):
    print(f"\n{C.H}{C.BD}{'=' * 50}\n  {t}\n{'=' * 50}{C.E}\n")


def step(t):
    print(f"{C.CY}>> {t}{C.E}")


def ok(t):
    print(f"{C.G}[OK] {t}{C.E}")


def err(t):
    print(f"{C.R}[ERROR] {t}{C.E}")


def warn(t):
    print(f"{C.Y}[!] {t}{C.E}")


def ask(prompt, default=None, required=True):
    p = (
        f"{C.BD}{prompt}{C.E} [{C.CY}{default}{C.E}]: "
        if default
        else f"{C.BD}{prompt}{C.E}: "
    )
    while True:
        a = input(p).strip()
        if not a and default:
            return default
        if a or not required:
            return a
        warn("Required field.")


def ask_yn(prompt, default=True):
    p = f"{C.BD}{prompt}{C.E} [{C.CY}{'Y/n' if default else 'y/N'}{C.E}]: "
    a = input(p).strip().lower()
    return default if not a else a in ("y", "yes", "1")


def check_prereqs():
    header("Checking Prerequisites")
    for cmd, name, url in [
        (["git", "--version"], "Git", "https://git-scm.com"),
        (["node", "--version"], "Node.js", "https://nodejs.org"),
        (["npm", "--version"], "npm", None),
    ]:
        step(f"Checking {name}...")
        try:
            r = subprocess.run(cmd, capture_output=True, text=True)
            ok(f"{name}: {r.stdout.strip()}")
        except FileNotFoundError:
            err(f"{name} not found." + (f" Install: {url}" if url else ""))
            sys.exit(1)


def get_config():
    header("Project Configuration")
    cfg = {}

    print(f"{C.BD}--- Basic Info ---{C.E}\n")
    cfg["site_name"] = ask("Site Name", "My Obsidian Blog")
    cfg["site_desc"] = ask("Description", "Zero-cost CMS powered by Obsidian")
    cfg["author"] = ask(
        "Author", os.environ.get("USERNAME", os.environ.get("USER", "author"))
    )

    print(f"\n{C.BD}--- GitHub ---{C.E}\n")
    cfg["gh_user"] = ask("GitHub Username")
    cfg["gh_repo"] = ask("Repository", cfg["site_name"].lower().replace(" ", "-"))
    cfg["site_url"] = ask("Site URL", f"https://{cfg['gh_repo']}.vercel.app")

    print(f"\n{C.BD}--- Categories ---{C.E}\n")
    cats = ask("Categories (comma-separated)", "posts, tutorials, notes")
    cfg["categories"] = [c.strip() for c in cats.split(",")]

    print(f"\n{C.BD}--- Options ---{C.E}\n")
    cfg["personas"] = ask_yn("Use multiple author personas?", False)
    cfg["plugins"] = ask_yn("Configure Obsidian plugins?", True)

    return cfg


def update_package(cfg, d):
    p = d / "package.json"
    with open(p, "r") as f:
        pkg = json.load(f)
    pkg["name"] = cfg["gh_repo"]
    pkg["description"] = cfg["site_desc"]
    pkg["author"] = cfg["author"]
    pkg["repository"] = {
        "type": "git",
        "url": f"https://github.com/{cfg['gh_user']}/{cfg['gh_repo']}.git",
    }
    with open(p, "w") as f:
        json.dump(pkg, f, indent=2)
    ok("Updated package.json")


def update_build(cfg, d):
    p = d / "site" / "src" / "build.js"
    with open(p, "r") as f:
        c = f.read()
    c = re.sub(
        r"siteUrl: process\.env\.SITE_URL \|\| '[^']*'",
        f"siteUrl: process.env.SITE_URL || '{cfg['site_url']}'",
        c,
    )
    c = re.sub(r"siteName: '[^']*'", f"siteName: '{cfg['site_name']}'", c)
    with open(p, "w") as f:
        f.write(c)
    ok("Updated build.js")


def setup_plugins(cfg, d):
    if not cfg["plugins"]:
        return
    od = d / ".obsidian"
    pd = od / "plugins"
    od.mkdir(exist_ok=True)
    pd.mkdir(exist_ok=True)

    # GitHub Sync
    gd = pd / "github-sync"
    gd.mkdir(exist_ok=True)
    with open(gd / "data.json", "w") as f:
        json.dump(
            {
                "remoteUrl": f"https://github.com/{cfg['gh_user']}/{cfg['gh_repo']}.git",
                "showRibbonIcon": True,
            },
            f,
            indent=2,
        )

    # Paste Image Rename
    pid = pd / "obsidian-paste-image-rename"
    pid.mkdir(exist_ok=True)
    with open(pid / "data.json", "w") as f:
        json.dump(
            {
                "imageNamePattern": "{{fileName}}_{{DATE:YYYYMMDD}}_{{NNNNN}}",
                "autoRename": True,
            },
            f,
            indent=2,
        )

    # Lists
    with open(od / "community-plugins.json", "w") as f:
        json.dump(
            [
                "github-sync",
                "obsidian-paste-image-rename",
                "templater-obsidian",
                "obsidian-linter",
            ],
            f,
        )
    with open(od / "app.json", "w") as f:
        json.dump(
            {
                "attachmentFolderPath": "content/_assets/images",
                "userIgnoreFilters": ["site/", "node_modules/", ".git/"],
            },
            f,
        )

    ok("Configured Obsidian plugins")


def setup_content(cfg, d):
    cd = d / "content"
    for cat in cfg["categories"]:
        slug = cat.lower().replace(" ", "-")
        (cd / slug).mkdir(parents=True, exist_ok=True)
        sample = cd / slug / f"welcome-to-{slug}.md"
        if not sample.exists():
            with open(sample, "w") as f:
                f.write(f"""---
title: "Welcome to {cat.title()}"
slug: "welcome-to-{slug}"
journalist: "author"
category: "{slug}"
tags: ["welcome"]
date: "{date.today().isoformat()}"
excerpt: "Sample post"
status: "published"
reading_time: "2 min"
---

# Welcome!

This is a sample post. Delete and start writing!
""")
    (cd / "_assets" / "images").mkdir(parents=True, exist_ok=True)
    ok(f"Created: {', '.join(cfg['categories'])}")


def update_readme(cfg, d):
    p = d / "README.md"
    with open(p, "r") as f:
        c = f.read()
    c = re.sub(r"# AI Cosmetics Innovation Journal", f"# {cfg['site_name']}", c)
    c = re.sub(
        r"https://github\.com/passeth/ai-diven_cos",
        f"https://github.com/{cfg['gh_user']}/{cfg['gh_repo']}",
        c,
        flags=re.I,
    )
    with open(p, "w") as f:
        f.write(c)
    ok("Updated README.md")


def setup_git(cfg, d):
    step("Setting up Git...")
    if not (d / ".git").exists():
        subprocess.run(["git", "init"], cwd=d, capture_output=True)
    url = f"https://github.com/{cfg['gh_user']}/{cfg['gh_repo']}.git"
    r = subprocess.run(
        ["git", "remote", "get-url", "origin"], cwd=d, capture_output=True
    )
    cmd = ["git", "remote", "set-url" if r.returncode == 0 else "add", "origin", url]
    subprocess.run(cmd, cwd=d, capture_output=True)
    ok(f"Remote: {url}")


def clean_sample(d):
    for f in ["development", "products", "ingredients", "trends", "tips", "videos"]:
        p = d / "content" / f
        if p.exists():
            shutil.rmtree(p)
    ok("Cleaned sample content")


def next_steps(cfg):
    header("Setup Complete!")
    print(f"{C.G}Your CMS is ready!{C.E}\n")
    print(f"1. Create repo: https://github.com/new -> {cfg['gh_repo']}")
    print(f"2. Open in Obsidian")
    print(f"3. Install plugins: GitHub Sync, Paste Image Rename, Templater, Linter")
    print(f"4. Deploy: https://vercel.com/new\n")
    print(f"{C.BD}Commands:{C.E}\n  npm run dev   - Preview\n  npm run build - Build\n")
    print(f"{C.CY}Happy blogging!{C.E}")


def main():
    header("Obsidian + GitHub + Vercel CMS Setup")
    d = Path(__file__).parent.absolute()
    print(f"Directory: {d}\n")

    check_prereqs()
    cfg = get_config()

    header("Summary")
    print(
        f"  Site: {cfg['site_name']}\n  Repo: {cfg['gh_user']}/{cfg['gh_repo']}\n  URL: {cfg['site_url']}\n  Categories: {', '.join(cfg['categories'])}\n"
    )

    if not ask_yn("Proceed?", True):
        print("\nCancelled.")
        sys.exit(0)

    header("Applying Configuration")
    if ask_yn("Remove sample content?", True):
        clean_sample(d)

    update_package(cfg, d)
    update_build(cfg, d)
    update_readme(cfg, d)
    setup_content(cfg, d)
    setup_plugins(cfg, d)
    setup_git(cfg, d)

    if ask_yn("Run npm install?", True):
        subprocess.run(["npm", "install"], cwd=d)

    next_steps(cfg)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCancelled.")
        sys.exit(0)
