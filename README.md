# Imagor.net Website

Professional landing page and early bird license sales page for the Imagor image processing ecosystem.

## 🌟 Features

- **Modern Design**: Clean, professional design optimized for conversions
- **Responsive**: Mobile-first design that works on all devices
- **Fast Loading**: Optimized CSS and JavaScript for performance
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Stripe Integration**: Ready for payment processing with Stripe + Zapier
- **GitHub Pages Ready**: Configured for easy deployment

## 📁 Project Structure

```
imagor-website/
├── index.html                 # Main landing page
├── buy/
│   └── early-bird/
│       └── index.html        # Early bird license purchase page
├── assets/
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   ├── js/
│   │   └── main.js           # Interactive features
│   └── images/               # Image assets (to be added)
├── CNAME                     # GitHub Pages custom domain
└── README.md                 # This file
```

## 🚀 Deployment to GitHub Pages

### 1. Create GitHub Repository

```bash
# Create a new repository on GitHub named 'imagor-website'
# Then push this code:

cd imagor-website
git init
git add .
git commit -m "Initial commit: Imagor.net website"
git branch -M main
git remote add origin git@github.com:yourusername/imagor-website.git
git push -u origin main
```

### 2. Configure GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

### 3. Configure Custom Domain

1. In your domain registrar (where you bought imagor.net):
   - Add A records pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Add CNAME record: `www.imagor.net` → `yourusername.github.io`

2. For subdomain routing (buy.imagor.net):
   - Add CNAME record: `buy.imagor.net` → `yourusername.github.io`

3. Wait for DNS propagation (can take up to 24 hours)

### 4. Enable HTTPS

GitHub Pages automatically provides SSL certificates for custom domains. Once your domain is configured:

1. Go to repository Settings → Pages
2. Check "Enforce HTTPS" (may take a few minutes to become available)

## 💳 Payment Integration Setup

### Stripe Configuration

1. **Create Stripe Account**
   - Sign up at [stripe.com](https://stripe.com)
   - Complete business verification
   - Get your publishable and secret keys

2. **Update Stripe Keys**
   - Replace `pk_test_51234567890abcdef` in `buy/early-bird/index.html` with your actual publishable key

3. **Create Product in Stripe**
   ```bash
   # Using Stripe CLI or Dashboard
   # Product: "Imagor Studio Early Bird License"
   # Price: $39.00 USD (one-time payment)
   ```

### Zapier Automation Setup

1. **Create Zapier Account**
   - Sign up at [zapier.com](https://zapier.com)
   - Upgrade to a paid plan (required for webhooks)

2. **Create Zap Workflow**
   - Trigger: Stripe "New Payment"
   - Action 1: Code by Zapier (generate license key)
   - Action 2: Email by Zapier (send license to customer)

3. **License Generation Code**
   ```javascript
   // Add this to your Zapier Code step
   const crypto = require('crypto');
   
   // Your private key from MONETIZATION_SUMMARY.md
   const PRIVATE_KEY_B64 = 'TDFt6oM8i+mzH17+UPP4LSr9+vfBUA3X5UvBsFiJ8Re/khP5+9k9Q5kiSmnR9z596E+cyqPeXQAPnqKy/y4H9w==';
   
   function generateLicenseKey(payload) {
       payload.iat = Math.floor(Date.now() / 1000);
       
       const payloadJson = JSON.stringify(payload);
       const payloadB64 = Buffer.from(payloadJson).toString('base64url');
       
       const privateKey = Buffer.from(PRIVATE_KEY_B64, 'base64');
       const signature = crypto.sign(null, Buffer.from(payloadJson), {
           key: privateKey,
           type: 'ed25519'
       });
       
       const signatureB64 = signature.toString('base64url');
       return `IMGR-${payloadB64}.${signatureB64}`;
   }
   
   // Generate license from Stripe webhook data
   const licenseKey = generateLicenseKey({
       type: 'personal',
       email: inputData.customer_email,
       features: ['batch_export', 'api_access', 'white_label', 'priority_support']
   });
   
   output = [{ 
       license_key: licenseKey, 
       customer_email: inputData.customer_email,
       customer_name: inputData.customer_name
   }];
   ```

4. **Email Template**
   ```
   Subject: Your Imagor Studio License Key
   
   Hi {{customer_name}},
   
   Thank you for purchasing Imagor Studio! Here's your license key:
   
   {{license_key}}
   
   To activate:
   1. Open Imagor Studio
   2. Go to Settings → License
   3. Enter your license key
   4. Click "Activate"
   
   Need help? Reply to this email for priority support.
   
   Best regards,
   The Imagor Team
   ```

### Webhook Endpoint (Optional)

For more control, you can create your own webhook endpoint:

```javascript
// Example Node.js webhook endpoint
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook signature verification failed.`);
    }
    
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Generate and send license key
        const licenseKey = generateLicenseKey({
            type: 'personal',
            email: session.customer_details.email
        });
        
        // Send email with license key
        sendLicenseEmail(session.customer_details.email, licenseKey);
    }
    
    res.json({received: true});
});
```

## 🎨 Customization

### Colors and Branding

Update CSS variables in `assets/css/style.css`:

```css
:root {
    --primary-color: #2563eb;    /* Main brand color */
    --accent-color: #f59e0b;     /* CTA buttons */
    --text-primary: #1e293b;     /* Main text */
    /* ... */
}
```

### Content Updates

- **Landing page**: Edit `index.html`
- **Buy page**: Edit `buy/early-bird/index.html`
- **Pricing**: Update price in both HTML and JavaScript
- **Features**: Modify feature lists and descriptions

### Adding Images

1. Add images to `assets/images/`
2. Update HTML to reference images:
   ```html
   <img src="assets/images/hero-bg.jpg" alt="Description">
   ```

## 📊 Analytics Setup

### Google Analytics

Add to `<head>` section:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Conversion Tracking

Track button clicks:

```javascript
// Add to buy page
document.getElementById('checkout-button').addEventListener('click', () => {
    gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: 39.00
    });
});
```

## 🔧 Development

### Local Development

```bash
# Serve locally (Python)
cd imagor-website
python -m http.server 8000

# Or with Node.js
npx serve .

# Visit http://localhost:8000
```

### Testing

- Test responsive design on different devices
- Verify all links work correctly
- Test form submissions (with test Stripe keys)
- Check page load speed with Lighthouse

## 📈 SEO Optimization

### Current Optimizations

- ✅ Semantic HTML structure
- ✅ Meta descriptions and keywords
- ✅ Open Graph tags
- ✅ Fast loading times
- ✅ Mobile-responsive design
- ✅ Clean URLs

### Additional Recommendations

1. **Add sitemap.xml**
2. **Create robots.txt**
3. **Add structured data (JSON-LD)**
4. **Optimize images with alt tags**
5. **Add blog section for content marketing**

## 🚨 Security Considerations

- Never commit real Stripe secret keys to Git
- Use environment variables for sensitive data
- Validate all webhook signatures
- Implement rate limiting for API endpoints
- Use HTTPS everywhere (enforced by GitHub Pages)

## 📞 Support

For questions about this website:
- Email: hello@imagor.net
- GitHub Issues: [Create an issue](https://github.com/yourusername/imagor-website/issues)

## 📄 License

This website code is MIT licensed. The Imagor brand and content are proprietary.

---

**Next Steps:**
1. Deploy to GitHub Pages
2. Configure domain DNS
3. Set up Stripe account
4. Create Zapier automation
5. Test payment flow
6. Launch! 🚀
