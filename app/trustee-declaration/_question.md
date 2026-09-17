thanks this is now working as expected. lets now focus on the ui /ux beauty.
first i want you to learn that our users are mobile phone first.
now make the form input fields to be h-10, rounded-md is ok, we can also have primary outline as the focus-within, remove the description that you added that is particular to me that is the developer, and add description that is friendly to the actual user.
Assume it's a page on the app. so we may need to add header title and description appropriately if possible a friendly appropriate featured image or background to support the page. then assume max-w-3xl for the form itself.
but here is the most important part, how we preview. we might decide to apply aspect ratio that keeps the pdf preview within the media size. and probably make it a drawer sheet from bottom to top. making it mobile and seemless. 
but bear in mind that what we download is the actual original generated document irrespective of any distortion in the preview.