import axios from 'axios';

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

export {
    siteLookup
}