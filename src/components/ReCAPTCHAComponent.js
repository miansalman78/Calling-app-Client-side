import React, { useState, useRef } from 'react';
    import { View, Button, Alert } from 'react-native';
    import { WebView } from 'react-native-webview';
    import { RECAPTCHA_SITE_KEY } from "../utils/Constants";

    const ReCAPTCHAComponent = ({ onVerify }) => {
      const webViewRef = useRef(null);
      const [captchaVerified, setCaptchaVerified] = useState(false);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>reCAPTCHA demo: Simple page</title>
            <script src="https://www.google.com/recaptcha/enterprise.js" async defer></script>
        </head>
        <body>
            <form action="" method="POST">
            <div class="g-recaptcha" data-sitekey="${RECAPTCHA_SITE_KEY}" data-action="LOGIN"></div>
            <br/>
            <input type="submit" value="Submit">
            </form>
        </body>
        </html>
      `;

      const handleWebViewMessage = (event) => {
        const token = event.nativeEvent.data;
        if (token) {
          setCaptchaVerified(true);
          onVerify(token);
        }
      };

      return (
        <View style={{ height: 75, width: '100%' }}>
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            style={{ flex: 1 }}
          />
        </View>
      );
    };

    export default ReCAPTCHAComponent;