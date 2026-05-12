/**
 * App-wide configuration constants.
 *
 * This file exports only:
 *   - app       — shop metadata (name, contact, social links)
 *   - BANK_INFO — payment bank transfer details
 *
 * Data arrays (categories, products, news) have been removed.
 * They are replaced by API service calls in tasks #8-13.
 */

export const app = {
  shopName: "Đức Điện Thoại",
  shopLogo: "/assets/logos/logo.png",
  shopLogoWhite: "/assets/logos/logo.png",
  address: "Khu phố Chiêu Liêu, Phường Tân Đông Hiệp, Dĩ An, Bình Dương",
  phones: ["0353.643.3396", "0123.456.789"],
  email: "@gmail.com",
  facebook: "https://www.facebook.com/lequangduc1006/",
  instagram: "https://www.instagram.com/w.dduwcs_o4/",
  twitter: "https://twitter.com/duc.lequang04",
  youtube: "https://www.youtube.com/duc.lequang04",
  tiktok: "https://www.tiktok.com/duc.lequang04",
  zalo: "https://zalo.me/duc.lequang04",
  shoppee: "https://shopee.vn/duc.lequang04",
  lazada: "https://www.lazada.vn/shop/duc.lequang04",
  tiki: "https://tiki.vn/duc.lequang04",
  facebookMessenger: "https://m.me/duc.lequang04",
  mapEmbed:
    process.env.NEXT_PUBLIC_STORE_MAP_EMBED ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3!2d106.758!3d10.9568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d4f2b8e9e8e7%3A0x1!2zS2h1IHBo4buRIENoacOqdSBMacOqdSwgVMOibiDEkMO0bmcgSGnhu4dwLCBExKkgQW4sIELDrG5oIETGsMahbmc!5e0!3m2!1svi!2s!4v1",
  storeLat: Number(process.env.NEXT_PUBLIC_STORE_LAT) || 10.9568,
  storeLng: Number(process.env.NEXT_PUBLIC_STORE_LNG) || 106.758,
};

export const BANK_INFO = {
  bank: "Mbbank",
  accountNumber: "9347366345",
  accountHolder: "Đức Điện Thoại",
  qrImage: "/assets/commons/qr_bank.png",
};
