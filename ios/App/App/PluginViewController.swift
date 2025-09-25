// PluginViewController.swift
import UIKit
import Capacitor

class PluginViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = .white
        webView?.backgroundColor = .white

        // Setup padding after the view has been added to the view hierarchy
        DispatchQueue.main.async {
            self.setupStatusBarBackground()
            self.setupWebViewPadding()
        }
    }

    override open func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        //Setup padding each time the view appears
        DispatchQueue.main.async {
            self.setupWebViewPadding()
        }
    }

    override open func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        //Setup padding whenever the view's layout changes (e.g. orientation changes)
        setupWebViewPadding()
    }   

    private func setupWebViewPadding() {
        guard let webView = self.webView else { return }

        var topPadding: CGFloat = 0        
        var leftPadding: CGFloat = 0
        var rightPadding: CGFloat = 0

        if #available(iOS 13.0, *) {
            let window = view.window ?? UIApplication.shared.windows.first { $0.isKeyWindow }

            topPadding = window?.windowScene?.statusBarManager?.statusBarFrame.height ?? 0            
            leftPadding = window?.safeAreaInsets.left ?? 0
            rightPadding = window?.safeAreaInsets.right ?? 0

        } else {
            topPadding = UIApplication.shared.statusBarFrame.size.height
        }

        webView.frame.origin = CGPoint(x: leftPadding, y: topPadding)
        webView.frame.size = CGSize(
            width: UIScreen.main.bounds.width - leftPadding - rightPadding, height: UIScreen.main.bounds.height - topPadding)
    }

    private func setupStatusBarBackground() {
        if #available(iOS 13.0, *) {
            let statusBar = UIView(frame: UIApplication.shared.windows.filter {$0.isKeyWindow}.first?.windowScene?.statusBarManager?.statusBarFrame ?? CGRect.zero)
            UIApplication.shared.windows.filter {$0.isKeyWindow}.first?.addSubview(statusBar)
        } else {
            let statusBar = UIApplication.shared.value(forKey: "statusBarWindow.statusBar") as? UIView
        }
    }
    }
