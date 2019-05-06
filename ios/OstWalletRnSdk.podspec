
Pod::Spec.new do |s|
  s.name         = "OstWalletRnSdk"
  s.version      = "1.0.0"
  s.summary      = "OstWalletRnSdk"
  s.description  = <<-DESC
                  OstWalletRnSdk
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/author/OstWalletRnSdk.git", :tag => "master" }
  s.source_files  = "OstWalletRnSdk/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  