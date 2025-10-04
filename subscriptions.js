// Hardcoded subscription data
const SUBSCRIPTIONS_DATA = {
  "subscriptions": [
    {
      "id": "UCvjgXvBlbQiydffZU7m1_aw",
      "name": "The Coding Train",
      "thumbnail": "https://yt3.googleusercontent.com/99wepc_FTSN0n_GbR-FlFANyxed7TsbE8WxKIDWftdxssZlYo1-gW1CRD7cPgOzThMM8m4W8=s176-c-k-c0x00ffffff-no-rj"
    },
    { "id": "UCW5YeuERMmlnqo4oq8vwUpg", "name": "Net Ninja", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_mk2Ex-8sW03SBlBX7D1EC5skH0kv9rS3rU9IXq2I-q2Zg=s176-c-k-c0x00ffffff-no-rj" },
    { "id": "UC29ju8bIPH5as8OGnQzwJyA", "name": "Traversy Media", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_mLysKc36lc_FVk2j777olWvLOjgDz6NCNGdiQBnAKRENM=s176-c-k-c0x00ffffff-no-rj" },
    { "id": "UCJZv4d5rbIKd4QHMPkcABCw", "name": "Kevin Powell", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_mQczyuvnXgEq8fApoOXpG2Yw_JKYqRA7kVOhNFuHLz9Vc=s176-c-k-c0x00ffffff-no-rj" },
    { "id": "UCxX9wt5FWQUAAz4UrysqK9A", "name": "CS Dojo", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_mxJvgrBjcgK94ZJQwDphl0UFkCKRL8AOa7UvmR__MIyg=s176-c-k-c0x00ffffff-no-rj" },
    {
      "id": "UCaO6VoaYJv4kS-TQO_M-N_g",
      "name": "Clément Mihailescu",
      "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_koIU1OQ1u1tCCZkWN0Q_gvs9kCc3xEDz7pGQjtl32ugqyY=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UC806fwFWpiLQV5y-qifzHnA",
      "name": "William Candillon",
      "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_n9Js-4GfgTSupvRPTk46nY9xvaGjT7LNeAdJsPwZpgGrg=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UC8butISFwT-Wl7EV0hUK0BQ",
      "name": "freeCodeCamp.org",
      "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_lGRc-05M2OoE1ejQdxeFhyP7OkJg9h4Y-7CK_5je3QqFI=s176-c-k-c0x00ffffff-no-rj"
    },
    { "id": "UCJbPGzawDH1njbqV-D5HqKw", "name": "thenewboston", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_luVhNF6yTdaq1SHoMmVoBAYcvUZkOBsXfEnuwcGf-G4y8=s176-c-k-c0x00ffffff-no-rj" },
    {
      "id": "UCVyTG4sCw-rOvB9oHkzZD1w",
      "name": "Creative Tim Tutorials",
      "thumbnail": "https://yt3.googleusercontent.com/nbwGhGzaDiy55B2aBVmMfqn3UqA_XVogW3SN4k671bbbHx5sha2yOHQ-5lV0D2xITTriFRZh7Q=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCWv7vMbMWH4-V0ZXdmDpPBA",
      "name": "Programming with Mosh",
      "thumbnail": "https://yt3.googleusercontent.com/lCeCb47hCbXWFa0I4gi8uWDHzWSs7sjK4FDmk7lFEUMRNp6QRzIQOkwaKhwv7eNKZacRI2uR=s176-c-k-c0x00ffffff-no-rj"
    },
    { "id": "UCzt9b4u-bik3U4G8GfHItdg", "name": "AppMaster", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_mMd3Tp1Li_9O0TiiuOd66NMmN3HdUwLP_KLIuXdc76FA=s176-c-k-c0x00ffffff-no-rj" },
    { "id": "UCQHLxxBFrbfdrk1jF0moTpw", "name": "Love Babbar", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_krv40fPSZ2UDcfAgx-mvf86wIm52oBZnuMLiaju9oxvQ=s176-c-k-c0x00ffffff-no-rj" },
    {
      "id": "UCAp3b6zIvS8ct4yci-GwxIg",
      "name": "Simpletivity",
      "thumbnail": "https://yt3.googleusercontent.com/NvvfKoMKV48hJUF4j_7kjmAiOZP93HWM1NL2A9pPqs0e2J1V86uqyldipp2FU1UE0aoV2rT0Gg=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCBqFKDipsnzvJdt6UT0lMIg",
      "name": "Sandeep Maheshwari",
      "thumbnail": "https://yt3.googleusercontent.com/W-LbQKXkf3HJsvau1PC8jnOoryI_7AjdGGORmmpWUO4Bdb3Alem-X4fasmV43aRXRydCy3gyAig=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCWr0mx597DnSGLFk1WfvSkQ",
      "name": "Hallden",
      "thumbnail": "https://yt3.googleusercontent.com/zSyzPCfmx18A0sDiVyGFsO44fIw5HKiaEykxr09JD6b2l3n-foKJAvO-WsRwfIJrPRZpuwb6Qvk=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCdngmbVKX1Tgre699-XLlUA",
      "name": "TechWorld with Nana",
      "thumbnail": "https://yt3.googleusercontent.com/kXyR8Aa32KXnZWVdkAFUYK5utM752kSJPHGtYiJ4ev6BmdFHi-dl1EFbI3TogmHBjszwc7m2=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UC0RhatS1pyxInC00YKjjBqQ",
      "name": "GeeksforGeeks",
      "thumbnail": "https://yt3.googleusercontent.com/2Vh4NlpOdxCECWi6cP2vBugq2WMwad37pj26OopOV_12LF43KoEgPPBcry8MAdESz6Iqy5bkzYU=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCgz2M4uU3x9MrMcMFSwQzzg",
      "name": "Coding with Dee",
      "thumbnail": "https://yt3.googleusercontent.com/a1-52G0POi3hrMcZh6MskWcbCEObS-I_5QO7vBSTPFpWZsBBeItup7VWv0vbAyYFkyGZg-_HtZE=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCFbNIlppjAuEX4znoulh0Cw",
      "name": "Web Dev Simplified",
      "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_nO3F7DfVXaf6wsHPS_hF327ggeWUCwZSELb5DCWBL1aw=s176-c-k-c0x00ffffff-no-rj"
    },
    { "id": "UC7DdEm33SyaTDtWYGO2CwdA", "name": "Physics Girl", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_mHLaE8gTxfKJQk8IzA0W-eRAhkogyb1B_aU2yzafp3ots=s176-c-k-c0x00ffffff-no-rj" },
    {
      "id": "UCf6AGqO98eGk11nfazociVQ",
      "name": "ByteGrad",
      "thumbnail": "https://yt3.googleusercontent.com/0TGYwRSjCshcMBsT7Ir3s4dm_X8SZohmuK7lCgR2_Hwjqq8yELeLNxCpeXLH10-UwWeBnrIE=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UClQDYiE75-po906ZDbx_11g",
      "name": "General Musings with Kevin Powell",
      "thumbnail": "https://yt3.googleusercontent.com/RIeyHhn2MVfxYiy-Y6qFHl7t7WFLpziVLwlhg4X2qYlRlKsTvHZOtJDNDuAOTQCjRe3TLwlE=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCVD5Vh9LhLBxp3o1vRNyf_w",
      "name": "London App Brewery",
      "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_kRcKOU4apMYom4t7jG-mr15F2pKD_eAfStKx_h49pVyg=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCPxMZIFE856tbTfdkdjzTSQ",
      "name": "BeerBiceps",
      "thumbnail": "https://yt3.googleusercontent.com/kunsF59HYsPPWyUfANFwx3cr4Vm4wkVRsZI3KLPzcVWHBTLR1UJ0vW9T0SxzIaTUZGndEM7Tgnc=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCXuO_AmrcE16fDoNiq9JZZg",
      "name": "Coke Studio India ",
      "thumbnail": "https://yt3.googleusercontent.com/aQa68OgmDomJYpCVgIrr8jQ01d5JFpIag88mmWB8zjvX1BNc2qSp0P06eUmZMSrng0Gio_mbTQ=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCM1VesJtJ9vTXcMLLr_FfdQ",
      "name": "Coke Studio Pakistan",
      "thumbnail": "https://yt3.googleusercontent.com/nOd4MDguLocyCgkOOs1YBF0xZfvafKP27Q_E6BwK85myVX9BWhSEBePoeIrhuil_PoYb5O-gOg=s176-c-k-c0x00ffffff-no-rj"
    },
    { "id": "UC-0NPN0sLa8l5W1r2z_LMCQ", "name": "S Kumaresan", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_mp9cVLZRu2wT-jHXOLqf8PCFQnP85iw6ajND3RqjRIBc0=s176-c-k-c0x00ffffff-no-rj" },
    {
      "id": "UC5fcjujOsqD-126Chn_BAuA",
      "name": "Sarthak Goswami",
      "thumbnail": "https://yt3.ggpht.com/lo7REjHf-TvopIU5x6fX_FWEKbaMZGIvSn4DbKFQ5KI6kAjf1shZmr-lA_UWwCfO-nML83YBjLM=s176-c-k-c0x00ffffff-no-rj"
    },
    { "id": "UC4JX40jDee_tINbkjycV4Sg", "name": "Tech With Tim", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_k15oXl74WcnpdL-uVBv6IHBgAfXEEnpUiS-IoEyV1auyY=s176-c-k-c0x00ffffff-no-rj" },
    { "id": "UC4xKdmAXFh4ACyhpiQ_3qBw", "name": "TechLead", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_mB5T8qEWIbRDWQm_CSSxUA9sJsWwopSzhjbRL3dVPiVP8=s176-c-k-c0x00ffffff-no-rj" },
    {
      "id": "UC5mnBodB73bR88fLXHSfzYA",
      "name": "Eddie Jaoude",
      "thumbnail": "https://yt3.googleusercontent.com/O3KOrxrlnZnDEzTs2X6QKIMu6qkqBtNekrkhewYT87qC4mO_1_1BpZ7VsyOlM5KW9TiYFRLuPwo=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UC-ga3onzHSJFAGsIebtVeBg",
      "name": "Lavendaire",
      "thumbnail": "https://yt3.googleusercontent.com/JP2YQE_2aPhokzwH6HunVkRkDofIpVT-xIXS91q5XLSj31rWkmZdS6sD7eCr8gxsGm5_zrVH=s176-c-k-c0x00ffffff-no-rj"
    },
    { "id": "UCoOae5nYA7VqaXzerajD0lg", "name": "Ali Abdaal", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_m2xx6mCZwsyjARnkwBKJxEv0FqGxGS2NwWNkjWH__Smw=s176-c-k-c0x00ffffff-no-rj" },
    { "id": "UCaYF1G_L5J7sqJzEeBVUDzw", "name": "Rowena Tsai", "thumbnail": "https://yt3.ggpht.com/ytc/AIdro_nFr7EN1ZXtkuXk1BhyCk_rAMx-G1SO8xqMbIc4_zNHsS8=s176-c-k-c0x00ffffff-no-rj" },
    { "id": "UCrdWRLq10OHuy7HmSckV3Vg", "name": "Nathaniel Drew", "thumbnail": "https://yt3.googleusercontent.com/ytc/AIdro_k3dZrYTuTMFvutkuaR77Xz_TqhLy4aUZCDlniAles92gc=s176-c-k-c0x00ffffff-no-rj" },
    {
      "id": "UC0sA4gvlWFHfdwaPlBDqnGg",
      "name": "muchelleb",
      "thumbnail": "https://yt3.googleusercontent.com/UJkYAwuAVcMSCRfcI6VTzMLXlL-lll9cgQd0rNJtnZNfmbSp1UqJkFJAczxiOuvTNsDzN_H8PA=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCJdP8a4IrIXLY8kG3SMzliA",
      "name": "Tess Barclay & Busy Blooming",
      "thumbnail": "https://yt3.googleusercontent.com/bnEZUo_OEten0PhZKgcKHFMmr7oteZFQP7rukdmFEIBPKHhlKIoN3gQ_YW83fZARWb-zfO5qkU4=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCnYMOamNKLGVlJgRUbamveA",
      "name": "Tom Bilyeu",
      "thumbnail": "https://yt3.googleusercontent.com/YlvzX-ktdEvgvN6TPOvjZWldQ0bCA1F9TPwVWTqOKUXZIDk5XHpQP5JE_tUmkF2k9UJZU_aR=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCRPMAqdtSgd0Ipeef7iFsKw",
      "name": "Gaurav Sen",
      "thumbnail": "https://yt3.googleusercontent.com/rsKAERVEXNTq6lbdIHUlm3aVAw4R2D1fPkDz-7sPccu9qwic5EYfSe6VI7tNB5-_r0Ip5_P0=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCZgt6AzoyjslHTC9dz0UoTw",
      "name": "ByteByteGo",
      "thumbnail": "https://yt3.googleusercontent.com/efrVnDJbJOQ5XcXrrFhA9V2wTXh6gP_i0KycoYjqhN3nEh6VbCgqMQakAcFqEsguw7wxhHEjnA=s176-c-k-c0x00ffffff-no-rj"
    },
    {
      "id": "UCXgGY0wkgOzynnHvSEVmE3A",
      "name": "Hitesh Choudhary",
      "thumbnail": "https://yt3.googleusercontent.com/VLOvpKYxd_ZTrjrorHo5VkqaO0lM1Zs2Zbe-Nrfx7UkWnUGKNbpgEcDxhSjDWS4UONdtyKddLQ=s176-c-k-c0x00ffffff-no-rj"
    }
  ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SUBSCRIPTIONS_DATA;
}