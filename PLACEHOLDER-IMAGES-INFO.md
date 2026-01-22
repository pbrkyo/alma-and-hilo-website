# Placeholder Stock Images - Action Required

## Summary

This document explains the placeholder image strategy for the Alma & Hilo website and provides actionable steps to add appropriate stock images.

---

## Current Situation

The website currently references the following images that need to be added or replaced:

### ✅ Already Present (Brand Assets)
- `/public/images/logo.png`
- `/public/images/banner.png`
- `/public/images/etiquetas.png`

### ⚠️ Need to Add (Placeholder Stock Images)
The following images are referenced in the code but need to be downloaded from free stock photo sites:

1. **Hero Section**
   - `/public/images/hero-lifestyle.jpg` - Woman in crochet dress

2. **Story Section**
   - `/public/images/mother-daughter.jpg` - Mother and daughter together

3. **Products Section**
   - `/public/images/product-bag.jpg` - Crochet bag
   - `/public/images/product-top.jpg` - Crochet top
   - `/public/images/product-dress.jpg` - Crochet dress
   - `/public/images/product-accessory.jpg` - Crochet accessory

4. **Process Section**
   - `/public/images/hands-crochet.jpg` - Hands crocheting close-up
   - `/public/images/yarn-materials.jpg` - Yarn and materials

**Total Images Needed**: 8 placeholder images

---

## Quick Action Plan

### Option 1: Download Images Yourself (Recommended)

1. **Read the Guide**
   - Open `/STOCK-IMAGES-GUIDE.md` for detailed instructions
   - Review recommended sources and search terms

2. **Visit Free Stock Photo Sites**
   - **Unsplash**: https://unsplash.com
   - **Pexels**: https://www.pexels.com
   - **Pixabay**: https://pixabay.com

3. **Download Images**
   - Use the search terms provided in the guide
   - Download high-resolution versions (1920px+ recommended)
   - Save with exact filenames listed above

4. **Save to Project**
   - Save all images to: `/public/images/`
   - Ensure filenames match exactly (case-sensitive)

5. **Optimize Images** (Optional but Recommended)
   - Use TinyPNG (https://tinypng.com) to compress
   - Target file size: under 500KB per image

6. **Test Website**
   - Run the development server
   - Verify all images display correctly

### Option 2: Use Specific Recommendations

Here are direct links to get started quickly:

#### 1. Mother-Daughter Image
- **Source**: Pexels
- **Photo**: "Two Women in Knitted Sweaters" by cottonbro studio
- **URL**: https://www.pexels.com/photo/two-women-in-knitted-sweaters-5493800/
- **Save as**: `mother-daughter.jpg`

#### 2-8. Other Images
- **Source**: Unsplash or Pexels
- **Search Terms**:
  - "crochet dress woman" → `hero-lifestyle.jpg`
  - "crochet bag handmade" → `product-bag.jpg`
  - "crochet top fashion" → `product-top.jpg`
  - "crochet dress bohemian" → `product-dress.jpg`
  - "crochet accessories" → `product-accessory.jpg`
  - "hands crocheting close up" → `hands-crochet.jpg`
  - "cotton yarn natural colors" → `yarn-materials.jpg`

---

## Important Notes

### These Are Temporary Placeholders

⚠️ **All stock images should eventually be replaced with actual Alma & Hilo brand photography**:
- Real photos of the founders (María & Sofía)
- Actual product photography
- Authentic workspace and process photos
- Real customer lifestyle shots

### Why Use Placeholders?

1. **Visual Development**: See how the website looks with real images
2. **Layout Testing**: Ensure image sizes and layouts work correctly
3. **Client Presentation**: Show the website design with realistic content
4. **Temporary Solution**: Until professional brand photography is available

### Legal & Licensing

- All recommended sources (Unsplash, Pexels, Pixabay) offer **free commercial use**
- **No attribution required** (though appreciated)
- Images are free to use, modify, and distribute
- Safe for commercial websites

---

## File Structure

```
alma-and-hilo-website/
├── public/
│   └── images/
│       ├── logo.png ✅ (brand asset - keep)
│       ├── banner.png ✅ (brand asset - keep)
│       ├── etiquetas.png ✅ (brand asset - keep)
│       ├── hero-lifestyle.jpg ⚠️ (need to add)
│       ├── mother-daughter.jpg ⚠️ (need to add)
│       ├── product-bag.jpg ⚠️ (need to add)
│       ├── product-top.jpg ⚠️ (need to add)
│       ├── product-dress.jpg ⚠️ (need to add)
│       ├── product-accessory.jpg ⚠️ (need to add)
│       ├── hands-crochet.jpg ⚠️ (need to add)
│       ├── yarn-materials.jpg ⚠️ (need to add)
│       └── README.md 📄 (documentation)
├── STOCK-IMAGES-GUIDE.md 📄 (detailed guide)
├── PLACEHOLDER-IMAGES-INFO.md 📄 (this file)
└── ...
```

---

## Aesthetic Guidelines

When selecting images, look for:

### Color Palette Match
- **Forest Green**: #2F4F3E
- **Sage Green**: #8FAE9A
- **Ivory**: #F7F5F0
- **Linen Beige**: #D2C4B2

### Style Characteristics
- Natural lighting (warm, soft)
- Authentic, handmade aesthetic
- Artisan quality
- Intimate, personal feel
- Traditional craftsmanship
- Costa Rican warmth

### Avoid
- Overly polished/commercial looks
- Harsh lighting
- Busy backgrounds
- Bright, artificial colors
- Generic stock photo feel

---

## Testing Checklist

After adding images, verify:

- [ ] All 8 images are in `/public/images/` folder
- [ ] Filenames match exactly (case-sensitive)
- [ ] Images are optimized (reasonable file sizes)
- [ ] Website runs without image errors
- [ ] Images display correctly on all pages
- [ ] Images look good on mobile devices
- [ ] Images match the brand aesthetic
- [ ] Images are properly licensed (free commercial use)

---

## Next Steps

1. **Immediate**: Download and add the 8 placeholder images
2. **Short-term**: Test website with placeholder images
3. **Long-term**: Plan and execute professional brand photoshoot
4. **Final**: Replace all placeholders with actual Alma & Hilo photos

---

## Resources

### Documentation Files
- `/STOCK-IMAGES-GUIDE.md` - Comprehensive guide with specific recommendations
- `/public/images/README.md` - Image directory documentation and replacement guidelines

### Free Stock Photo Sites
- **Unsplash**: https://unsplash.com (Best for artistic, lifestyle shots)
- **Pexels**: https://www.pexels.com (Great variety, easy to use)
- **Pixabay**: https://pixabay.com (Large collection, reliable)

### Image Optimization Tools
- **TinyPNG**: https://tinypng.com (Easy compression)
- **Squoosh**: https://squoosh.app (Advanced options)
- **ImageOptim**: https://imageoptim.com (Mac app)

---

## Questions or Issues?

If you encounter any problems:

1. Check that filenames match exactly (including `.jpg` extension)
2. Verify images are saved in `/public/images/` directory
3. Clear browser cache and refresh
4. Check browser console for error messages
5. Refer to the detailed guide in `/STOCK-IMAGES-GUIDE.md`

---

## Summary of What Was Done

✅ Created comprehensive stock image guide (`STOCK-IMAGES-GUIDE.md`)
✅ Created image directory documentation (`/public/images/README.md`)
✅ Created this action plan document
✅ Researched and identified best free stock photo sources
✅ Provided specific image recommendations and search terms
✅ Documented aesthetic guidelines and technical specifications
✅ Created clear checklist for image replacement workflow

**Status**: Ready for you to download and add placeholder images!

---

**Created**: January 2026
**Last Updated**: January 2026
