// @ts-nocheck
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import AvailableNetworks from "./utils/socials";

let $window: Window | null = typeof window !== "undefined" ? window : null;

export function mockWindow(self: Window | null) {
  $window = self || window;
}

export default defineComponent({
  name: "Shareme",

  props: {
    network: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    quote: {
      type: String,
      default: "",
    },
    hashtags: {
      type: String,
      default: "",
    },
    twitterUser: {
      type: String,
      default: "",
    },
    media: {
      type: String,
      default: "",
    },
    tag: {
      type: String,
      default: "a",
    },
    popup: {
      type: Object,
      default: () => ({
        width: 626,
        height: 436,
      }),
    },
  },

  setup(props) {
    const popupTop = ref(0);
    const popupLeft = ref(0);
    let popupWindow: Window | null = undefined;
    let popupInterval: number | null = null;

    const networks = ref<Record<string, string>>(
      $window?.$SocialSharing
        ? $window.$SocialSharing.options.networks
        : AvailableNetworks
    );

    const key = props.network.toLowerCase();

    const rawLink = computed(() => {
      const ua = navigator.userAgent.toLowerCase();

      if (
        key === "sms" &&
        (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1)
      ) {
        return networks.value[key].replace(":?", ":&");
      }

      return networks.value[key];
    });

    const shareLink = computed(() => {
      let link = rawLink.value;

      if (key === "twitter") {
        if (!props.hashtags.length) link = link.replace("&hashtags=@h", "");
        if (!props.twitterUser.length) link = link.replace("@tu", "");
      }

      return link
        .replace(/@tu/g, "&via=" + encodeURIComponent(props.twitterUser))
        .replace(/@u/g, encodeURIComponent(props.url))
        .replace(/@t/g, encodeURIComponent(props.title))
        .replace(/@d/g, encodeURIComponent(props.description))
        .replace(/@q/g, encodeURIComponent(props.quote))
        .replace(/@h/g, encodedHashtags.value)
        .replace(/@m/g, encodeURIComponent(props.media));
    });

    const encodedHashtags = computed(() => {
      if (key === "facebook" && props.hashtags.length) {
        return "%23" + props.hashtags.split(",")[0];
      }

      return props.hashtags;
    });

    const resizePopup = () => {
      const width =
        $window?.innerWidth ||
        document.documentElement.clientWidth ||
        $window?.screenX;
      const height =
        $window?.innerHeight ||
        document.documentElement.clientHeight ||
        $window?.screenY;
      const systemZoom = width / $window?.screen.availWidth;

      popupLeft.value =
        (width - props.popup.width) / 2 / systemZoom +
        ($window?.screenLeft !== undefined
          ? $window.screenLeft
          : $window?.screenX);
      popupTop.value =
        (height - props.popup.height) / 2 / systemZoom +
        ($window?.screenTop !== undefined
          ? $window.screenTop
          : $window?.screenY);
    };

    const emit = (name: string) => {
      const root = getCurrentInstance()?.appContext.app;
      root?.emit("share_me" + name, key, props.url);
      props.emit(name, key, props.url);
    };

    const share = () => {
      resizePopup();

      if (popupWindow && popupInterval) {
        clearInterval(popupInterval);
        popupWindow.close();
        emit("change");
      }

      popupWindow = $window?.open(
        shareLink.value,
        "sharer-" + key,
        `,height=${props.popup.height},width=${props.popup.width},left=${popupLeft.value},top=${popupTop.value},screenX=${popupLeft.value},screenY=${popupTop.value}`
      );

      if (!popupWindow) return;

      popupWindow.focus();

      popupInterval = setInterval(() => {
        if (!popupWindow || popupWindow.closed) {
          clearInterval(popupInterval);
          popupWindow = null;
          emit("close");
        }
      }, 500);

      emit("open");
    };

    const touch = () => {
      $window?.open(shareLink.value, "_blank");
      emit("open");
    };

    onMounted(() => {
      $window?.addEventListener("resize", resizePopup);
    });

    onBeforeUnmount(() => {
      $window?.removeEventListener("resize", resizePopup);
    });

    return {
      popupTop,
      popupLeft,
      shareLink,
      networks,
      encodedHashtags,
      share,
      touch,
    };
  },

  render() {
    if (!this.networks.hasOwnProperty(this.key)) {
      throw new Error("Network " + this.key + " does not exist");
    }

    const node = {
      class: "share-me-" + this.key,
      onClick: () =>
        this.rawLink.substring(0, 4) === "http" ? this.share() : this.touch(),
    };

    if (this.tag === "a") node.attrs = { href: "javascript:void(0)" };

    return h(this.tag, node, this.$slots.default);
  },
});
