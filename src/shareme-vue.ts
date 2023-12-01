// @ts-nocheck
import { App, Plugin } from "vue";
import AvailableNetworks from "./utils/socials";
import ShareMe from "./shareme";

export const SocialSharingPlugin: Plugin = {
  install: (app: App, options: { networks?: Record<string, string> } = {}) => {
    app.component(ShareMe.name, ShareMe);

    app.config.globalProperties.$SocialSharing = {
      options: {
        networks: options.networks
          ? { ...AvailableNetworks, ...options.networks }
          : AvailableNetworks,
      },
    };
  },
};

export { ShareMe };
