import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = AppBridgeViewController()
        window?.makeKeyAndVisible()

        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}


// MARK: - Anmeldung mit Google/Apple (12.11.2026)
//
// Der In-App-Browser (SFSafariViewController) gab den Rücksprung
// de.<app>.app://anmeldung nicht an die App zurück – das Fenster blieb
// nach „Weiter“ einfach stehen. ASWebAuthenticationSession ist Apples
// Fenster genau für Anmeldungen: Es fängt den Rücksprung selbst ab,
// schließt sich und gibt die Adresse an JavaScript (appAnmeldung.js).
import AuthenticationServices

@objc(AnmeldungPlugin)
public class AnmeldungPlugin: CAPPlugin, CAPBridgedPlugin, ASWebAuthenticationPresentationContextProviding {
    public let identifier = "AnmeldungPlugin"
    public let jsName = "Anmeldung"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "starten", returnType: CAPPluginReturnPromise)
    ]
    private var sitzung: ASWebAuthenticationSession?

    @objc func starten(_ call: CAPPluginCall) {
        guard let adresse = call.getString("url"), let url = URL(string: adresse),
              let schema = call.getString("schema") else {
            call.reject("Adresse fehlt")
            return
        }
        DispatchQueue.main.async {
            let s = ASWebAuthenticationSession(url: url, callbackURLScheme: schema) { [weak self] rueck, fehler in
                self?.sitzung = nil
                if let rueck = rueck {
                    call.resolve(["url": rueck.absoluteString])
                } else if let f = fehler as? ASWebAuthenticationSessionError, f.code == .canceledLogin {
                    call.reject("abgebrochen", "ABGEBROCHEN")
                } else {
                    call.reject(fehler?.localizedDescription ?? "Anmeldung fehlgeschlagen")
                }
            }
            s.presentationContextProvider = self
            self.sitzung = s
            if !s.start() { call.reject("Anmeldefenster ließ sich nicht öffnen") }
        }
    }

    public func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        return bridge?.viewController?.view.window ?? ASPresentationAnchor()
    }
}

/// Eigene Bridge, damit das Anmelde-Plugin oben registriert wird.
class AppBridgeViewController: CAPBridgeViewController {
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(AnmeldungPlugin())
    }
}
