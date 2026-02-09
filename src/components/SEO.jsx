import { Helmet } from 'react-helmet-async';
import { APP_CONFIG } from '../config/appConfig';

function SEO({ title, description, image, type = 'website' }) {
    const siteTitle = APP_CONFIG.name;
    const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || APP_CONFIG.description;
    // Use the first feature icon as fallback or a default image if available
    const metaImage = image;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{pageTitle}</title>
            <meta name="description" content={metaDescription} />

            {/* Open Graph tags (Facebook, LinkedIn) */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={metaDescription} />
            {metaImage && <meta property="og:image" content={metaImage} />}

            {/* Twitter tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={metaDescription} />
            {metaImage && <meta name="twitter:image" content={metaImage} />}
        </Helmet>
    );
}

export default SEO;
