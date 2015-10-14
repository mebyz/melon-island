//
//  ViewController.swift
//  Simple Universal Webview App
//
//  Created by Nabil Freeman on 19/06/2015.
//  Copyright (c) 2015 Freeman Industries. All rights reserved.
//
import UIKit
import WebKit



var lmPath: String!
var dicPath: String!
var words: Array<String> = []
var currentWord: String!

var kLevelUpdatesPerSecond = 18

   class ViewController: UIViewController, OEEventsObserverDelegate {
        
        var openEarsEventsObserver = OEEventsObserver()
        var startupFailedDueToLackOfPermissions = Bool()
        
        var buttonFlashing = false
    
    
        func record() {
            
            //if !buttonFlashing {
            
            NSLog("START");
            startListening()
            
            let time = dispatch_time(dispatch_time_t(DISPATCH_TIME_NOW), 20 * Int64(NSEC_PER_SEC))
            dispatch_after(time, dispatch_get_main_queue()) {
                
                NSLog("STOP");
                self.stopListening()
                //put your code which should be executed with a delay here
            }
            //} else {
            //}
        }
        
        func loadOpenEars() {
            
            self.openEarsEventsObserver = OEEventsObserver()
            self.openEarsEventsObserver.delegate = self
            
            let lmGenerator: OELanguageModelGenerator = OELanguageModelGenerator()
            
            addWords()
            let name = "LanguageModelFileStarSaver"
            lmGenerator.generateLanguageModelFromArray(words, withFilesNamed: name, forAcousticModelAtPath: OEAcousticModel.pathToModel("AcousticModelEnglish"))
            
            lmPath = lmGenerator.pathToSuccessfullyGeneratedLanguageModelWithRequestedName(name)
            dicPath = lmGenerator.pathToSuccessfullyGeneratedDictionaryWithRequestedName(name)
        }
        
        func pocketsphinxDidChangeLanguageModelToFile(newLanguageModelPathAsString: String, newDictionaryPathAsString: String) {
            //println("Pocketsphinx is now using the following language model: \(newLanguageModelPathAsString) and the following dictionary: \(newDictionaryPathAsString)")
        }
    
        func startListening() {
            try! OEPocketsphinxController.sharedInstance().setActive(true)
            
            
            OEPocketsphinxController.sharedInstance().startListeningWithLanguageModelAtPath(lmPath, dictionaryAtPath: dicPath, acousticModelAtPath: OEAcousticModel.pathToModel("AcousticModelEnglish"), languageModelIsJSGF: false)
        }
        
        func stopListening() {
            OEPocketsphinxController.sharedInstance().stopListening()
        }
        
        func addWords() {
            //add any thing here that you want to be recognized. Must be in capital letters
            words.append("GO")
            words.append("STOP")
        }
        
        func getNewWord() {
            let randomWord = Int(arc4random_uniform(UInt32(words.count)))
            currentWord = words[randomWord]
        }
        
        func pocketsphinxFailedNoMicPermissions() {
            
            NSLog("Local callback: The user has never set mic permissions or denied permission to this app's mic, so listening will not start.")
            self.startupFailedDueToLackOfPermissions = true
            if OEPocketsphinxController.sharedInstance().isListening {
                let error = OEPocketsphinxController.sharedInstance().stopListening() // Stop listening if we are listening.
                if(error != nil) {
                    NSLog("Error while stopping listening in micPermissionCheckCompleted: %@", error);
                }
            }
        }
        
        func pocketsphinxDidReceiveHypothesis(hypothesis: String!, recognitionScore: String!, utteranceID: String!) {
            
            NSLog("Heard: \(hypothesis)");
        }
    
    
    var wkWebView: WKWebView?
    var uiWebView: UIWebView?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.

        // Get main screen rect size
        let screenSize: CGRect = UIScreen.mainScreen().bounds
        
        // Construct frame where webview will be pop
        let frameRect: CGRect = CGRect(x: 0, y: 0, width: screenSize.width, height: screenSize.height)

        // Create url request from local index.html file located in web_content
        let urlPath: String = "http://tinyurl.com/fbxeby"
        let url: NSURL = NSURL(string: urlPath)!
        let requestObj: NSURLRequest = NSURLRequest(URL: url);
        // Test operating system
        if NSProcessInfo().isOperatingSystemAtLeastVersion(NSOperatingSystemVersion(majorVersion: 8, minorVersion: 0, patchVersion: 0)) {
            
            self.wkWebView = WKWebView(frame: frameRect)
            self.wkWebView?.loadRequest(requestObj)
            self.view.addSubview(self.wkWebView!)

        } else {

            self.uiWebView = UIWebView(frame: frameRect)
            self.uiWebView?.loadRequest(requestObj)
            self.view.addSubview(self.uiWebView!)
        }
        
        loadOpenEars()
        record()

    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    //Commented:    black status bar.
    //Uncommented:  white status bar.
    override func preferredStatusBarStyle() -> UIStatusBarStyle {
        return UIStatusBarStyle.LightContent
    }

}

