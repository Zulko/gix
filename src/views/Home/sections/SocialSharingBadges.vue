<template lang="pug">
.social-sharing-badges-section
  h2 Tell a friend
  .social-sharing-badges
    ShareNetwork(
      v-for="network in networks",
      :network="network.network",
      :key="network.network",
      :style="{ backgroundColor: network.color }",
      :url="sharing.url",
      :title="sharing.title",
      :description="sharing.description",
      :quote="sharing.quote",
      :hashtags="sharing.hashtags",
      :twitterUser="sharing.twitterUser"
    )
      i(:class="network.icon")
      span {{ network.name }}
</template>

<script>

import { ShareNetwork } from 'vue-social-sharing';

export default {
  data() {
    return {
      sharing: {
        url: 'https://zulko.github.io/gix/#/home',
        title: 'Gix - Create and remix GIFs in your browser',
        description: 'Create and remix GIFs, all in your browser.',
        quote: 'https://zulko.github.io/gix/#/home',
        hashtags: 'GIF,share,remix',
      },
      networks: [
        {
          network: 'email',
          name: 'Email',
          icon: 'mdi mdi-email',
          color: '#333333',
        },
        {
          network: 'twitter',
          name: 'Twitter',
          icon: 'mdi mdi-twitter',
          color: '#1da1f2',
        },
        {
          network: 'reddit',
          name: 'Reddit',
          icon: 'mdi mdi-reddit',
          color: '#ff4500',
        },
        {
          network: 'whatsapp',
          name: 'Whatsapp',
          icon: 'mdi mdi-whatsapp',
          color: '#25d366',
        },
        {
          network: 'facebook',
          name: 'Facebook',
          icon: 'mdi mdi-facebook',
          color: '#1877f2',
        },
        {
          network: 'vk',
          name: 'Vk',
          icon: 'mdi mdi-alpha-v-box-outline',
          color: '#4a76a8',
        },
        {
          network: 'weibo',
          name: 'Weibo',
          icon: 'mdi mdi-sina-weibo',
          color: '#e9152d',
        },
      ],
    };
  },
  components: {
    ShareNetwork,
  },
};
</script>

<style>
.social-sharing-badges {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1000px;
  margin: 1.5em auto;
}
.social-sharing-badges a {
  flex: none;
  color: #ffffff;
  background-color: #333;
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 10px 10px 0;
}
.social-sharing-badges a .mdi {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 4px;
  flex: 0 1 auto;
}
.social-sharing-badges a span {
  padding: 0 10px;
  flex: 1 1 0%;
  font-weight: 500;
}
</style>
