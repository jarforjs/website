//通过后缀名获取MIME文件类型
function querySuffixType(suffix) {
    var suffixType=null;
    switch (suffix){
        case "HTML":
            suffixType="text/html";
            break;
        case "CSS":
            suffixType="text/css";
            break;
        case "JS":
            suffixType="text/javascript";
            break;
        case "TXT":
            suffixType="text/plain";
            break;
        case "JSON":
            suffixType="application/json";
            break;
        case "JPG":
        case "JPEG":
            suffixType="image/jpeg";
            break;
        case "PNG":
            suffixType="image/png";
            break;
        case "GIF":
            suffixType = "image/gif";
            break;
        case "BMP":
            suffixType = " application/x-MS-bmp";
            break;
        case "SVG":
            suffixType = "image/svg+xml";
            break;
        case "ICO":
        case "ICON":
            suffixType = "image/x-icon";
            break;
        default:
            suffixType="text/plain"
    }
    return suffixType;
}

module.exports={
    querySuffixType:querySuffixType
}