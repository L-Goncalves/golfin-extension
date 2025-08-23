import { getAllJobStorage } from "~content-scripts/storage";
import { Storage } from "@plasmohq/storage";
const isDEV = process.env.NODE_ENV == "development"
export async function migrateJobData() {
    const storage = new Storage();
    const migrationKey = 'migration_v1'; // Key to track migration version
    const hasMigrated = await storage.getItem(migrationKey); // Check migration status
   console.log({hasMigrated})
    // Get the current version from the manifest
    const manifest = chrome.runtime.getManifest();
    const currentVersion = manifest.version || '0.0.0'; // Default to '0.0.0' if not set

    // Compare versions: function to compare version strings
    const isVersionHigher = (current, target) => {
        const currentParts = current.split('.').map(Number);
        const targetParts = target.split('.').map(Number);

        for (let i = 0; i < Math.max(currentParts.length, targetParts.length); i++) {
            const currentPart = currentParts[i] || 0; // Default to 0 if part is missing
            const targetPart = targetParts[i] || 0; // Default to 0 if part is missing
            if (currentPart > targetPart) return true;
            if (currentPart < targetPart) return false;
        }
        return false; // Versions are equal
    };

    // Run the migration only if it hasn't been run yet and the version is higher than 0.2.3
    if (!hasMigrated && isVersionHigher(currentVersion, '0.2.3')) {
        const existingJobs = await getAllJobStorage();

        existingJobs.forEach(async job => {
            // Add a default value for lastSeen if it doesn't exist
            const jobData = {
                ...job,
                lastSeen: job.lastSeen || new Date().toISOString() 
            };
            storage.setItem(`job_${jobData.jobId}`, JSON.stringify(jobData));

        });

        // Mark this migration as complete
        storage.setItem(migrationKey, true);
       console.log("Migration completed successfully.");
    } else if (hasMigrated) {
       console.log("Migration has already been run. No changes made.");
    } else {
       console.log("Current version is not higher than 0.2.3. Migration skipped.");
    }
}
