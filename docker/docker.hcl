group "default" {
  targets = ["graphql-mesh"]
}

target "graphql-mesh" {
  context = "."
  dockerfile = "Dockerfile"
  platforms = ["linux/amd64", "linux/arm64", "windows/amd64"]
  tags = [
    "ghcr.io/ardatan/graphql-mesh:v1",
    "ghcr.io/ardatan/graphql-mesh:latest",
    "ghcr.io/ardatan/graphql-mesh:${COMMIT_SHA}"
  ]
  args = {
    GITHUB_TOKEN = "${GITHUB_TOKEN}"
  }
}
