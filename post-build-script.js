const fs = require("fs");

// Read the index.ts file
fs.readFile(
  "packages/react-library/lib/components/stencil-generated/index.ts",
  "utf8",
  (err, data) => {
    if (err) {
      console.error("Error reading index.ts:", err);
      return;
    }

    // Replace the import statement
    let updatedContent = data.replace(
      "import type { JSX } from 'unity-ambient-x/dist/components';",
      "import type { JSX } from 'unity-ambient-x';"
    );

    updatedContent = updatedContent.replace(
      'import type { JSX } from "unity-ambient-x/dist/components";',
      'import type { JSX } from "unity-ambient-x";'
    );

    // Write the updated content back to index.ts
    fs.writeFile(
      "packages/react-library/lib/components/stencil-generated/index.ts",
      updatedContent,
      (err) => {
        if (err) {
          console.error("Error writing index.ts:", err);
        } else {
          console.log("index.ts file updated successfully");
        }
      }
    );
  }
);