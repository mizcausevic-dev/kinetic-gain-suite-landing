# kinetic-gain-suite-landing (retired)

Historical landing-site source for the **[Kinetic Gain Protocol Suite](https://github.com/mizcausevic-dev/kinetic-gain-protocol-suite)**. The live Suite has moved beyond these files. [kg-suite-web](https://github.com/mizcausevic-dev/kg-suite-web) is the successor source; its own release instructions and live-byte baselines must be reviewed before any upload.

The public site remains **[suite.kineticgain.com](https://suite.kineticgain.com)**. This repository is not evidence of its current served bytes.

## What's here

```
.
├── index.html              # the landing page
├── style.css               # styles (emerald + slate, dark-mode hero)
├── .github/workflows/
│   └── deploy.yml          # manual-only, blocking retired-source guard
└── README.md
```

No build step.

## Local preview

```bash
python3 -m http.server 8080
```

## Release status: BLOCKED

The prior push-triggered SFTP/FTPS workflow could overwrite newer Suite files from this stale checkout. Its replacement is manual-only and fails before requesting credentials or transferring data. No deployment, hosted-byte verification, or rollback was run for this historical repository. For a Suite release, start from `kg-suite-web`, compare every intended destination against a reviewed live baseline, save recoverable remote bytes, transfer only approved paths, then verify exact hosted bytes and restoration. That path remains a separate release gate.

## License

Apache-2.0.
