This project is a mobile version used for the admins
to manage tunari services

## To install

    * Install ionic
    * Run: npm install

## To run it

    * Run: ionic serve
    * Navigate to http://localhost:8081
    * You can add a query parameter ionicplatform=windows to test 
      other platforms.

## To build and run in android

    * ionic cordova run --device android

## To generate signed APK to google play store

    Following steps from: http://ionicframework.com/docs/v1/guide/publishing.html

    * Upgrade config.xml by updating the version in:
        <widget id="io.tervarsoft.gonter" version="0.0.7" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    * (Probably not needed anymore) Remove not needed plugins for production mode, so far.: 
        ionic cordova plugin rm cordova-plugin-console
    * Build release build for android
        ionic cordova build --release android
    * If no key exists, generate private key. Use already created private key, request to the team members. Just for documentation this key was generated     with this command, should not be created again (keytool in jdk, usually: c:\Program Files\Java\jdk1.8.0_74\):
        keytool -genkey -v -keystore gonter.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
    * Sing the unsigned APK.  The unsigned apk should be find in platforms/android/build/outputs/apk/android-release-unsigned.apk (jarsigner in jdk, usually: c:\Program Files\Java\jdk1.8.0_74\bin):
        jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore gonter.keystore android-release-unsigned.apk alias_name
    * Zip align (android sdk, usually: c:\Android\sdk\build-tools\23.0.3\):
        zipalign -v 4 android-release-unsigned.apk Gonter.apk
    
    * Finally you can upload your GrafTunari.apk to: https://play.google.com/apps/publish/
    
# To update sdk manager, run:   
    
    SDK Manager.exe in C:\Android\sdk