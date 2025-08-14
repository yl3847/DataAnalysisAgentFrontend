import ReactGA from 'react-ga4';

// Replace with your actual Measurement ID
const MEASUREMENT_ID = 'G-763S33F5V7'; // TODO: Replace with your actual GA4 Measurement ID

// Initialize Google Analytics
export const initGA = () => {
  try {
    ReactGA.initialize(MEASUREMENT_ID, {
      gaOptions: {
        // Optional: Add any additional config here
        anonymizeIp: true, // For GDPR compliance
      },
      gtagOptions: {
        // Optional: Add any gtag config here
        send_page_view: true,
      }
    });
    console.log('Google Analytics initialized');
  } catch (error) {
    console.error('Failed to initialize Google Analytics:', error);
  }
};

// Track page views
export const trackPageView = (path) => {
  try {
    ReactGA.send({ 
      hitType: "pageview", 
      page: path,
      title: document.title 
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

// Track events (for user interactions)
export const trackEvent = (category, action, label = null, value = null) => {
  try {
    ReactGA.event({
      category: category,
      action: action,
      label: label,
      value: value
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

// Track user origin and referrer
export const trackUserOrigin = () => {
  try {
    // Get referrer information
    const referrer = document.referrer || 'Direct';
    const urlParams = new URLSearchParams(window.location.search);
    
    // Track UTM parameters if they exist
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    
    // Track the origin
    if (utmSource) {
      trackEvent('User Origin', 'UTM Visit', `${utmSource}/${utmMedium}/${utmCampaign}`);
    } else {
      trackEvent('User Origin', 'Referrer', referrer);
    }
    
    // Track additional origin info
    const originData = {
      referrer: referrer,
      landing_page: window.location.pathname,
      utm_source: utmSource || 'none',
      utm_medium: utmMedium || 'none',
      utm_campaign: utmCampaign || 'none',
      user_agent: navigator.userAgent,
      language: navigator.language,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    
    // Send custom event with origin details
    ReactGA.gtag('event', 'user_origin_details', originData);
    
    console.log('User origin tracked:', originData);
  } catch (error) {
    console.error('Failed to track user origin:', error);
  }
};

// Track user engagement
export const trackEngagement = (action, label) => {
  trackEvent('User Engagement', action, label);
};

// Track API usage
export const trackApiCall = (query, success) => {
  trackEvent('API Usage', success ? 'Success' : 'Error', query);
};