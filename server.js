// server.js
import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

// Always resolve absolute path for output dir
const __dirname = path.resolve();
const outputDir = path.join(__dirname, "output");

// Ensure output dir exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Serve static files (public and output)
app.use(express.static("public"));
app.use("/output", express.static(outputDir));

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { pathInput, classInput, altInput } = req.body;
    const file = req.file;
    const baseName = path.parse(file.originalname).name;

    // Default snippet path if empty
    const snippetPath = pathInput?.trim() || "./assets/img/";

    // Sizes for AVIF
    const sizes = [450, 750, 1200];
    const generatedFiles = [];

    for (const size of sizes) {
      const outFile = `${baseName}-${size}.avif`;
      const outPath = path.join(outputDir, outFile);

      await sharp(file.path)
        .resize(size)
        .toFormat("avif")
        .toFile(outPath);

      generatedFiles.push(`/output/${outFile}`);
      console.log("Saved:", outPath);
    }

    // PNG fallback (only 450px)
    const pngFile = `${baseName}-450.png`;
    const pngPath = path.join(outputDir, pngFile);

    await sharp(file.path)
      .resize(450)
      .toFormat("png")
      .toFile(pngPath);

    generatedFiles.push(`/output/${pngFile}`);
    console.log("Saved:", pngPath);

    // Cleanup uploaded temp file
    fs.unlinkSync(file.path);

    // Build picture element HTML (using pathInput only for snippet!)
    const pictureHTML = `
<picture>
    <source srcset="${snippetPath}${baseName}-450.avif" type="image/avif">
    <source media="(min-width: 750px)" srcset="${snippetPath}${baseName}-750.avif" type="image/avif">
    <source media="(min-width: 1200px)" srcset="${snippetPath}${baseName}-1200.avif" type="image/avif">
    <img src="${snippetPath}${baseName}-450.png" class="${classInput}" width="450" height="auto" alt="${altInput}">
</picture>`.trim();

    const ImageList = `
    <div class="card">
        <div class="card-body">
            <ul>
                <li>${baseName}-450.avif</li>
                <li>${baseName}-750.avif</li>
                <li>${baseName}-1200.avif</li>
                <li>${baseName}-450.png</li>
            </ul>
        </div>
    </div>
    `;

    res.json({ files: generatedFiles, pictureHTML, ImageList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image processing failed" });
  }
});

//clear output folder before starting
function clearOutputFolder() {
  if (fs.existsSync(outputDir)) {
    fs.readdirSync(outputDir).forEach((file) => {
      fs.unlinkSync(path.join(outputDir, file));
    });
  }
}

clearOutputFolder();

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
  console.log("📂 Output folder:", outputDir);
});
