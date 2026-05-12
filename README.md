# kinetic-gain-suite-landing

Static landing site for the **[Kinetic Gain Protocol Suite](https://github.com/mizcausevic-dev/kinetic-gain-protocol-suite)** — the canonical front door for the family of ten open AI governance specs.

Live at **[suite.kineticgain.com](https://suite.kineticgain.com)**.

## What's here

```
.
├── index.html              # the landing page
├── style.css               # styles (emerald + slate, dark-mode hero)
├── .github/workflows/
│   └── deploy.yml          # FTPS push to /suite/ on Hostinger on push to main
└── README.md
```

No build step.

## Local preview

```bash
python3 -m http.server 8080
```

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that FTP-syncs the site root to `/suite/` on Hostinger. Reuses the standard `FTP_HOST`/`FTP_USER`/`FTP_PASS` secrets shared by the other kineticgain.com properties.

## License

Apache-2.0.
