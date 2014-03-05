describe "preloadImages", ->
  beforeEach ->
    img0 = ""
    img1 = ""
    img2 = ""

  it "should be right when param images is a img src string", ->


  it "should be right when param images is a img src array", ->


  it "should exec callback with param imgObj when preload success", ->


  it "should exec callback without param imgObj when preload error", ->


  it "should only once preload for same image", ->
