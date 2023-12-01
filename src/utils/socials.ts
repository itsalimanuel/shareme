interface ShareLinks {
  [key: string]: string;
}

const shareLinks: ShareLinks = {
  baidu: "http://cang.baidu.com/do/add?iu=@u&it=@t",
  email: "mailto:?subject=@t&body=@u%0D%0A@d",
  facebook:
    "https://www.facebook.com/sharer/sharer.php?u=@u&title=@t&description=@d&quote=@q&hashtag=@h",
  flipboard:
    "https://share.flipboard.com/bookmarklet/popout?v=2&url=@u&title=@t",
  line: "http://line.me/R/msg/text/?@t%0D%0A@u%0D%0A@d",
  linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=@u",
  messenger: "fb-messenger://share/?link=@u",
  odnoklassniki:
    "https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=@u&st.comments=@t",
  pinterest:
    "https://pinterest.com/pin/create/button/?url=@u&media=@m&description=@t",
  pocket: "https://getpocket.com/save?url=@u&title=@t",
  quora: "https://www.quora.com/share?url=@u&title=@t",
  reddit: "https://www.reddit.com/submit?url=@u&title=@t",
  skype: "https://web.skype.com/share?url=@t%0D%0A@u%0D%0A@d",
  sms: "sms:?body=@t%0D%0A@u%0D%0A@d",
  telegram: "https://t.me/share/url?url=@u&text=@t%0D%0A@d",
  tumblr: "https://www.tumblr.com/share/link?url=@u&name=@t&description=@d",
  x: "https://x.com/intent/tweet?text=@t&url=@u&hashtags=@h@tu",
  vk: "https://vk.com/share.php?url=@u&title=@t&description=@d&image=@m&noparse=true",
  whatsapp: "https://api.whatsapp.com/send?text=@t%0D%0A@u%0D%0A@d",
  xing: "https://www.xing.com/social/share/spi?op=share&url=@u&title=@t",
};

export default shareLinks;
