# 🚀 GitHub Actions Deployment Setup

This guide explains how to set up automated deployment using GitHub Actions with secure SSH key management.

## 🔐 Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

### 1. GCP_PRIVATE_KEY (Required)
Your SSH private key content for accessing the GCP server.

**To set this up:**
1. Copy your SSH private key content:
   ```bash
   cat ~/Downloads/id_ed25519
   ```
2. Go to GitHub repository → Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `GCP_PRIVATE_KEY`
5. Value: Paste the entire private key content (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)

### 2. GCP_HOST (Optional)
The IP address of your GCP server.
- **Name**: `GCP_HOST`
- **Default**: `35.223.194.70`
- **Value**: Your server IP address if different

### 3. GCP_USER (Optional)
The SSH username for your GCP server.
- **Name**: `GCP_USER`
- **Default**: `candidate`
- **Value**: Your SSH username if different

## 🛡️ Security Features

### User Restriction
The workflow includes `if: github.actor == 'nimibahar'` which ensures only you can trigger deployments.

### Branch Protection
Recommended branch protection rules for main branch:
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
- ✅ Restrict pushes to main branch
- ✅ Require administrators to follow these rules

### SSH Security
- Private key is encrypted in GitHub's secure vault
- Key is loaded into memory only during deployment
- Automatic cleanup ensures no key persistence
- Known hosts verification prevents MITM attacks

## 🔄 Deployment Workflow

1. **Create feature branch** for any changes
2. **Open pull request** from feature branch to main
3. **Review and merge PR** (only you can do this with branch protection)
4. **GitHub Actions automatically deploys** when PR is merged to main
5. **Deployment verification** ensures services are healthy
6. **Notification** of deployment success/failure

## 📝 Manual vs Automated Deployment

### Manual Deployment (Still Works)
```bash
./deploy.sh ~/Downloads/id_ed25519
```

### Automated Deployment 
Triggered automatically when you merge a PR to main.

## 🧪 Testing the Workflow

To test the GitHub Actions workflow:

1. **Set up secrets** as described above
2. **Create a test branch**:
   ```bash
   git checkout -b test-deployment
   echo "test" >> README.md
   git add . && git commit -m "Test deployment workflow"
   git push origin test-deployment
   ```
3. **Open PR** from test-deployment to main
4. **Merge the PR** (this will trigger deployment)
5. **Check Actions tab** to see deployment progress

## 🚨 Troubleshooting

### Common Issues

**1. "Actor not authorized" - Workflow skipped**
- Check that `github.actor == 'nimibahar'` matches your GitHub username
- Only you should be able to merge PRs to main

**2. "SSH connection failed"**
- Verify `GCP_PRIVATE_KEY` secret contains the correct private key
- Ensure the key matches the public key on your GCP server
- Check that `GCP_HOST` and `GCP_USER` are correct

**3. "Deployment script failed"**
- Check the Actions logs for detailed error messages
- Verify your GCP server is accessible
- Ensure Docker and docker-compose are available on the server

### Logs and Debugging
- GitHub Actions logs are available in the "Actions" tab
- SSH connection details are logged (but private key is redacted)
- Deployment verification provides health check results

## 🔧 Customization

### Change Target Server
Update the secrets:
- `GCP_HOST`: New server IP
- `GCP_USER`: New SSH username
- `GCP_PRIVATE_KEY`: Private key for new server

### Modify Deployment Process
Edit `.github/workflows/deploy.yml` to customize:
- Deployment steps
- Verification checks  
- Notification methods
- Additional security measures

### Add Approval Steps
For extra security, you can add manual approval:
```yaml
environment:
  name: production
  protection_rules:
    - type: required_reviewers
      required_reviewers: ["nimibahar"]
```