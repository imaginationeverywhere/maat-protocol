# Image Processor Agent

Specialized agent for image processing operations with **choice between free local tools and paid AI services**.

## 🚀 QUICK START - Nano Banana Pro (AI Image Generation)

**Nano Banana Pro** uses the `gemini-3-pro-image-preview` model for AI-powered image generation, logo creation, and complex editing.

### 1. Get API Key from AWS SSM (Recommended)

```bash
# Retrieve GEMINI_API_KEY from AWS Systems Manager Parameter Store
aws ssm get-parameter \
  --name "/quik-nation/shared/GEMINI_API_KEY" \
  --with-decryption \
  --query 'Parameter.Value' \
  --output text

# Create .env file with the key
echo "GEMINI_API_KEY=$(aws ssm get-parameter --name '/quik-nation/shared/GEMINI_API_KEY' --with-decryption --query 'Parameter.Value' --output text)" > .claude/skills/ccskill-nanobanana/.env
```

### 2. Or Set Key Manually

```bash
# If you have the key directly
echo "GEMINI_API_KEY=your-api-key-here" > .claude/skills/ccskill-nanobanana/.env
```

### 3. Use the `/image` Command

```bash
# Generate a logo
/image logo "World Cup Ready logo with soccer ball and city skyline"

# Remove complex background
/image remove-bg ./photo.jpg --tool paid

# Generate any image
/image generate "Modern sports stadium at sunset"
```

---

## Agent Type

`image-processor`

## Tool Selection

The agent supports two processing modes:

| Tool | Cost | Best For | Limitations |
|------|------|----------|-------------|
| **Free (Pillow/PIL)** | $0 | Solid color backgrounds, logos, icons | Struggles with gradients, shadows, fine edges |
| **Paid (Nano Banana Pro)** | ~$0.01-0.20/image | Complex backgrounds, photos, fine details | Requires API billing |

### Auto Mode Recommendations

| Task Complexity | Recommended Tool | Why |
|-----------------|------------------|-----|
| Solid color background | **Free (Pillow)** | Simple threshold-based removal |
| Gradient/complex background | **Paid (Nano Banana Pro)** | AI understands context |
| Fine edges (hair, fur) | **Paid (Nano Banana Pro)** | Better edge detection |
| Logo with white bg | **Free (Pillow)** | Solid backgrounds work well |
| Product photography | **Paid (Nano Banana Pro)** | Preserves shadows, details |

---

## Free Tool: Pillow/PIL

**Cost:** $0 (local processing)
**Speed:** Instant
**Installation:** Already included in Python stdlib

### Capabilities

- Remove solid color backgrounds (white, black, single colors)
- Basic color replacement
- Image format conversion
- Simple threshold-based transparency

### Prerequisites

```bash
pip install pillow
```

### Usage Examples

#### Remove White Background (Threshold Method)

```python
from PIL import Image

def remove_white_background(input_path, output_path, threshold=240):
    """Remove white background using threshold method."""
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()

    new_data = []
    for item in data:
        # If pixel is close to white (R, G, B all > threshold)
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            new_data.append((255, 255, 255, 0))  # Make transparent
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")
    return output_path

# Usage
remove_white_background("./logo.png", "./logo-transparent.png")
```

#### Remove Specific Color Background

```python
from PIL import Image

def remove_color_background(input_path, output_path, target_color, tolerance=30):
    """Remove a specific color background."""
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()

    r_target, g_target, b_target = target_color

    new_data = []
    for item in data:
        r_diff = abs(item[0] - r_target)
        g_diff = abs(item[1] - g_target)
        b_diff = abs(item[2] - b_target)

        if r_diff <= tolerance and g_diff <= tolerance and b_diff <= tolerance:
            new_data.append((255, 255, 255, 0))  # Transparent
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")
    return output_path

# Remove light gray background
remove_color_background("./image.png", "./output.png", target_color=(240, 240, 240))
```

#### Batch Processing (Free Tool)

```python
import os
from PIL import Image

def batch_remove_white_bg(input_dir, output_dir, threshold=240):
    """Batch remove white backgrounds from all images in directory."""
    os.makedirs(output_dir, exist_ok=True)

    for filename in os.listdir(input_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            input_path = os.path.join(input_dir, filename)
            output_name = os.path.splitext(filename)[0] + "-transparent.png"
            output_path = os.path.join(output_dir, output_name)

            remove_white_background(input_path, output_path, threshold)
            print(f"Processed: {filename}")

# Usage
batch_remove_white_bg("./logos", "./logos/transparent")
```

### Limitations

- ❌ Cannot handle gradient backgrounds
- ❌ Cannot handle complex/busy backgrounds
- ❌ Struggles with shadows and semi-transparent edges
- ❌ May leave halos around edges
- ❌ Cannot preserve fine details like hair or fur

---

## Paid Tool: Nano Banana Pro (Gemini 3 Pro Image)

**Model:** `gemini-3-pro-image-preview`
**Cost:** ~$0.01-0.20 per image (varies by complexity)
**Speed:** 5-15 seconds per image
**Billing:** Requires Google Cloud billing enabled

### Capabilities

- AI-powered context understanding
- Complex background removal
- Fine edge detection (hair, fur, feathers)
- Shadow preservation
- Style transfer and image generation
- Natural-looking cutouts

### Prerequisites

#### Environment Variables

```bash
# Required in .claude/skills/ccskill-nanobanana/.env
GEMINI_API_KEY=your-gemini-api-key

# Set skill directory path
export CCSKILL_NANOBANANA_DIR="/path/to/project/.claude/skills/ccskill-nanobanana"
```

#### API Key Setup

**Option A: From AWS SSM Parameter Store (Recommended for Quik Nation projects)**

```bash
# The GEMINI_API_KEY is stored in AWS SSM Parameter Store
# Retrieve and create .env file in one command:
echo "GEMINI_API_KEY=$(aws ssm get-parameter --name '/quik-nation/shared/GEMINI_API_KEY' --with-decryption --query 'Parameter.Value' --output text)" > .claude/skills/ccskill-nanobanana/.env

# Verify it worked
cat .claude/skills/ccskill-nanobanana/.env
```

**Option B: Manual Setup (for new/external projects)**

1. Go to https://aistudio.google.com/apikey
2. Create a new API key
3. **Enable billing** in Google Cloud Console (REQUIRED - no free tier)
4. Add key to `.claude/skills/ccskill-nanobanana/.env`:
   ```bash
   echo "GEMINI_API_KEY=your-key-here" > .claude/skills/ccskill-nanobanana/.env
   ```

**Option C: Store in AWS SSM (for team sharing)**

```bash
# Store a new key in SSM for all projects to use
aws ssm put-parameter \
  --name "/quik-nation/shared/GEMINI_API_KEY" \
  --value "your-gemini-api-key" \
  --type "SecureString" \
  --description "Gemini API key for Nano Banana Pro image generation"
```

### Pricing Reference

| Image Type | Estimated Cost |
|------------|----------------|
| Simple logo | ~$0.01-0.02 |
| Complex logo with gradients | ~$0.03-0.05 |
| Product photo | ~$0.05-0.10 |
| High-res photo (4K) | ~$0.10-0.20 |

*Prices are estimates based on Google Gemini API pricing. Actual costs may vary.*

### Execution Command

```bash
$CCSKILL_NANOBANANA_DIR/venv/bin/python $CCSKILL_NANOBANANA_DIR/generate_image.py "prompt" [options]
```

### Usage Examples

#### Remove Background (Transparent)

```bash
$CCSKILL_NANOBANANA_DIR/venv/bin/python $CCSKILL_NANOBANANA_DIR/generate_image.py \
  "Remove the background completely from this image. Make the background fully transparent while keeping the main subject (logo/icon) with crisp, clean, anti-aliased edges. Output as PNG with alpha transparency." \
  --reference ./input-image.png \
  --output ./output \
  --aspect 1:1
```

#### Remove Background (Solid Color Replacement)

```bash
$CCSKILL_NANOBANANA_DIR/venv/bin/python $CCSKILL_NANOBANANA_DIR/generate_image.py \
  "Remove the white background from this logo and replace it with a solid navy blue (#001F4F) background. Keep the logo crisp with clean edges." \
  --reference ./input-logo.png \
  --output ./output
```

#### Batch Processing (Paid Tool)

```python
import os
import subprocess

input_dir = "./logos"
output_dir = "./processed"
skill_dir = os.environ.get("CCSKILL_NANOBANANA_DIR")

for filename in os.listdir(input_dir):
    if filename.endswith(('.png', '.jpg', '.jpeg')):
        input_path = os.path.join(input_dir, filename)
        subprocess.run([
            f"{skill_dir}/venv/bin/python",
            f"{skill_dir}/generate_image.py",
            "Remove the white background from this image, making it fully transparent. Keep the subject with clean edges.",
            "--reference", input_path,
            "--output", output_dir,
            "--aspect", "1:1"
        ])
```

### Prompting Best Practices

#### For Logo Background Removal

```
"Remove the white/light background from this logo image completely.
Make the background fully transparent (alpha channel).
Keep the logo graphic with:
- Crisp, clean edges
- Anti-aliased borders
- Original colors preserved
- No artifacts or halos around edges
Output as PNG format with transparency."
```

#### For Product Images

```
"Remove the background from this product photo.
Make the background transparent.
Keep the product with:
- Natural shadows preserved (optional)
- Clean cutout edges
- Original lighting on product
- No color bleeding at edges"
```

#### For Complex Images (Hair, Fur)

```
"Carefully remove the background from this image while preserving:
- Fine details like hair/fur edges
- Semi-transparent elements
- Subtle shadows
Replace with transparent background.
Use edge refinement for natural-looking cutout."
```

### Options Reference

| Option | Description | Default |
|--------|-------------|---------|
| `--resolution` | Output resolution (1K, 2K, 4K) | 2K |
| `--aspect` | Aspect ratio (1:1, 16:9, 4:3, etc.) | 16:9 |
| `--output` | Output directory | ./generated_images |
| `--reference` | Input/reference image path | none |

---

## Tool Selection Workflow

When the `/image` command is invoked:

```
1. ANALYZE - Inspect image(s) for complexity
   ├── Solid color background? → Recommend FREE
   ├── Gradient/complex background? → Recommend PAID
   └── Fine edges (hair/fur)? → Recommend PAID

2. ESTIMATE - Show cost comparison
   ├── Free (Pillow): $0.00
   └── Paid (Nano Banana): ~$X.XX (count × ~$0.05)

3. PROMPT - User chooses tool
   ├── [1] Free - Pillow (local, instant)
   ├── [2] Paid - Nano Banana Pro (AI, ~$X.XX)
   └── [3] Cancel

4. PROCESS - Execute with chosen tool

5. REPORT - Show results and actual cost (if paid)
```

---

## S3 Upload Integration

After processing, upload to S3:

```bash
# Process image
$CCSKILL_NANOBANANA_DIR/venv/bin/python $CCSKILL_NANOBANANA_DIR/generate_image.py \
  "Remove white background, make transparent" \
  --reference ./wcr-california.png \
  --output ./processed

# Upload to S3
aws s3 cp ./processed/[timestamp].png \
  s3://world-cup-ready-assets/logos/wcr-california-transparent.png \
  --content-type "image/png"
```

---

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `GEMINI_API_KEY not set` | Missing API key | Add key to .env files |
| `429 RESOURCE_EXHAUSTED` | No billing enabled | Enable billing in Google Cloud Console |
| `API quota exceeded` | Rate limiting | Wait or increase quota |
| `Invalid image format` | Unsupported format | Convert to PNG/JPG first |
| `Reference image too large` | File size limit | Resize image before processing |
| Pillow: Halos around edges | Threshold too low | Increase threshold value |

---

## Cost Management

### For Paid Tool

- **Monitor:** Track API usage in Google Cloud Console
- **Batch:** Group similar operations to minimize API calls
- **Preview:** Use `--estimate` flag to see costs before processing
- **Budget:** Set billing alerts in Google Cloud Console

### Cost Optimization Tips

1. **Use Free Tool First** - Try Pillow for simple backgrounds
2. **Test on Single Image** - Before batch processing with paid tool
3. **Batch Similar Images** - Process all logos in one session
4. **Set Budget Alerts** - Avoid surprise charges

---

## Related Agents

- `aws-cloud-services-orchestrator` - S3 uploads after processing
- `ui-mockup-converter` - Convert mockups to code

## Related Commands

- `/image` - Comprehensive image toolkit (remove-bg, generate, edit, logo, resize, convert, optimize, style)

---

## Version

- **Version:** 2.0.0
- **Last Updated:** 2026-01-26
- **Skills:** Pillow (Free), nano-banana-pro (Paid)
