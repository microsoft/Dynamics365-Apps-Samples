# OneBranch.PullRequest.yml - Pipeline Documentation

## Overview

The OneBranch.PullRequest.yml pipeline is an Azure DevOps CI/CD pipeline that handles pull request validations for the Omnichannel.ALM project. It's built on Microsoft's OneBranch pipeline framework and automates the build, test, and deployment process for Dynamics 365/Power Platform solutions.

## File Location

```
c:\oc\Omnichannel.ALM\.pipelines\OneBranch.PullRequest.yml
```

## Purpose

This pipeline serves to:

1. Validate code changes submitted via pull requests to the main branch
2. Build Dynamics 365 solutions
3. Run automated tests and code quality checks.
4. Deploy solution and CMT configurations to development, pre-production and production environments
5. Provide a controlled promotion path through environments

## Pipeline Structure

### Trigger Configuration

```yaml
trigger:
  - main
```

The pipeline triggers automatically when changes are made to the main branch.

### Key Stages

1. **Solution Build Stage**
   - Builds Dynamics 365 solutions
   - Runs server-side unit tests
   - Performs solution checks with customized rule configurations
   - Creates artifacts for later stages

2. **ImportToIntermediateOrg Stage**
   - Downloads build artifacts
   - Creates CAB files from solution ZIPs
   - Signs solutions using ESRP (Enterprise Signing and Release Pipeline)
   - Authenticates with Power Platform
   - Imports configuration data (skills)
   - Deploys to intermediate development environment

3. **ImportToPPEOrg Stage**
   - Manually triggered stage (requires approval)
   - Similar process as intermediate stage
   - Deploys to pre-production environment

   **ImportToProdOrg Stage**
   - Manually triggered stage (requires approval)
   - Similar process as Ppe stage
   - Deploys to production environment

## Security and Compliance Features

- **Solution Signing**: Uses Microsoft ESRP to sign solution packages ensuring integrity and authenticity
- **SDL Controls**: Integrates Security Development Lifecycle tools:
  - BinSkim: Validates binaries for security best practices
  - PoliCheck: Scans for sensitive terms and terminology
- **Service Principal Authentication**: Secure connection to Power Platform environments
- **Controlled Promotion**: Manual approval required for PPE deployment

## External Dependencies

The pipeline references several external resources:

- **Variable Templates**:
  - Common build variables
  - Canonical build variables
  - OneBranch variables
  - PR-specific variables

- **External Repositories**:
  - OneCRM/CRM.Solutions.Tools.Pipelines
  - OneCRM/D365.Shared

## How to Run the Pipeline

### Automatic Execution

The pipeline will trigger automatically when:
- Code is pushed to the main branch
- Pull requests are created/updated targeting the main branch

### Manual Execution

To run the pipeline manually:

1. Navigate to Azure DevOps Pipelines
2. Locate the pipeline named after this YAML file
3. Click "Run pipeline"
4. Optionally toggle the debug parameter
5. Click "Run"

### Approving PPE Stage

For the ImportToPPEOrg stage:

1. Wait for the ImportToIntermediateOrg stage to complete successfully
2. Navigate to the running pipeline
3. Click "Review" on the ImportToPPEOrg stage
4. Click "Approve" to allow deployment to the PPE environment

## Troubleshooting

Common issues and solutions:

- **Build Failures**: Check the build logs for specific error messages
- **Signing Issues**: Verify ESRP connection is properly configured
- **Deployment Failures**: 
  - Check service principal credentials are valid
  - Verify target environments are available
  - Review solution import logs for conflicts or dependency issues

For detailed troubleshooting, enable the debug parameter when running the pipeline.

## Best Practices

When working with this pipeline:

1. Always run the pipeline on feature branches before merging to main
2. Check pipeline results before approving PPE deployments
3. Review solution checker warnings and resolve issues
4. Ensure all tests pass before promoting to higher environments

## Additional Resources

- [OneBranch Documentation](https://aka.ms/onebranch)
- [Power Platform Build Tools](https://learn.microsoft.com/en-us/power-platform/alm/devops-build-tools)
- [Solution Checker Reference](https://learn.microsoft.com/en-us/power-platform/alm/solution-checker-tool)

## Contact

For questions or issues related to this pipeline, please contact the Omnichannel.ALM team.

---

Last Updated: May 1, 2025