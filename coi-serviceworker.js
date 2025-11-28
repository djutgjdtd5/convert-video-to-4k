/*! coi-serviceworker v0.1.7 - Optimized for Google Bot */
let coepCredentialless = false;

if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
    
    self.addEventListener("message", (ev) => {
        if (!ev.data) {
            return;
        } else if (ev.data.type === "deregister") {
            self.registration.unregister().then(() => {
                return self.clients.matchAll();
            }).then(clients => {
                clients.forEach((client) => client.navigate(client.url));
            });
        }
    });

    self.addEventListener("fetch", function (event) {
        const r = event.request;
        if (r.cache === "only-if-cached" && r.mode !== "same-origin") {
            return;
        }
        
        const coepHeader = coepCredentialless ? "credentialless" : "require-corp";
        
        event.respondWith(fetch(r).then((response) => {
            if (response.status === 0 || response.type === 'opaque') {
                return response;
            }

            const newHeaders = new Headers(response.headers);
            newHeaders.set("Cross-Origin-Embedder-Policy", coepHeader);
            newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: newHeaders,
            });
        }));
    });

} else {
    (() => {
        const re = new RegExp("coi-serviceworker.js");

        if (navigator.serviceWorker && !navigator.serviceWorker.controller) {
            
            // 🛑 STOP: AGAR GOOGLE BOT HAI TO RELOAD MAT KARO
            const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
            if (isBot) {
                console.log("Bot detected. Skipping COI reload for SEO.");
                return;
            }

            navigator.serviceWorker.register("coi-serviceworker.js").then((registration) => {
                console.log("COI Service Worker registered");
                
                // Reload to activate headers (Only for Humans)
                window.location.reload();
            });
        }
    })();
}
