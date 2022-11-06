## Usage

### Docker

Setup nix flake

```bash
$ docker load < $(nix build ".#docker-image" --print-out-paths)
```
