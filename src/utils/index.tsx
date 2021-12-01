import axios from 'axios';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { NetworkConnector } from '@web3-react/network-connector';

interface Meta {
    title?: string;
    description?: string,
    image?: string
    url?: string,
    type?: string,
    site_name?: string
}

const readTag = (el: HTMLElement, name: string) => {
    const prop = el.getAttribute('name') || el.getAttribute('property');
    return prop === name ? el.getAttribute('content') : null;
};

async function siteLookup(url: string) {
    if (!/(^http(s?):\/\/[^\s$.?#].[^\s]*)/i.test(url)) return {};

    const config = {
        mode: 'no-cors',
        crossdomain: true,
        headers: {'Access-Control-Allow-Origin': '*'}
    };
    const og: Meta = {}, meta: Meta = {};
    const { data } = await axios.get('https://cors-anywhere.herokuapp.com/'+url, config);

    const domParser = new DOMParser();
    const document = domParser.parseFromString(data, 'text/html');
    const metas = document.querySelectorAll('meta');

    for (let i = 0; i < metas.length; i++) {
        const el = metas[i];

        ['title', 'description', 'image'].forEach(s => {
            const val = readTag(el, s);
            // @ts-ignore
            if (val) meta[s] = val;
        });

        ['og:title', 'og:description', 'og:image', 'og:url', 'og:site_name', 'og:type'].forEach(s => {
            const val = readTag(el, s);
            // @ts-ignore
            if (val) og[s.split(':')[1]] = val;
        });
    }

    const images = Array.from(document.querySelectorAll('img'))
        .map( (el: HTMLElement) => {
            let src: string|null = el.getAttribute('src');
            if (src) {
                src = new URL(src, url).href;
                return src;
            }
            return null
        })
        .filter( (el: string|null) => el !== null)

    return {
        og,
        meta,
        images
    };
}

const formatAddress = (account: string|null|undefined) => {
    const acc = account || '';
    return acc.substring(0, 6) + '...' + acc.substring(acc.length - 4)
};

const SUPPORTED_CHAINS = {
    Ropsten: 3,
    Rinkeby: 4
}
const injected = new InjectedConnector({ supportedChainIds: Object.values(SUPPORTED_CHAINS) });

const availableAddresses = {
    [SUPPORTED_CHAINS.Ropsten]: '0xD208456A8aC709361Ca327B9329113aD3C0A9FD9',
    [SUPPORTED_CHAINS.Rinkeby]: '0x9120b19e921fAf41d315B528dE711f99cf530725'
}

const walletconnect = new WalletConnectConnector({
    rpc: {
        [SUPPORTED_CHAINS.Ropsten]: 'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_API_KEY,
        [SUPPORTED_CHAINS.Rinkeby]: 'https://rinkeby.infura.io/v3/'+process.env.REACT_APP_INFURA_API_KEY,
    },
    infuraId: process.env.REACT_APP_INFURA_API_KEY,
    supportedChainIds: Object.values(SUPPORTED_CHAINS),
    qrcode: true
});

const network = new NetworkConnector({
    urls: {
        [SUPPORTED_CHAINS.Ropsten]: 'https://ropsten.infura.io/v3/'+process.env.REACT_APP_INFURA_API_KEY,
        [SUPPORTED_CHAINS.Rinkeby]: 'https://rinkeby.infura.io/v3/'+process.env.REACT_APP_INFURA_API_KEY
    },
    defaultChainId: SUPPORTED_CHAINS.Rinkeby,
});

export {
    siteLookup,
    SUPPORTED_CHAINS,
    injected,
    walletconnect,
    network,
    availableAddresses,
    formatAddress
}