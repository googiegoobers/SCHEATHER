export const GA_MEASUREMENT_ID = 'G-QMVC5BR2W3';

export const pageview = (url) => {
    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
    });
};
