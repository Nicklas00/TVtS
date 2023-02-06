import { WMTSCapabilities } from 'ol/format';
import TileLayer from 'ol/layer/Tile';
import { WMTS } from 'ol/source';
import { Options, optionsFromCapabilities } from 'ol/source/WMTS';
/**
 * Creates an OpenLayers WMTS source based on a capabilities URL. This is mostly boilerplate around a fetch and
 * OpenLayers' own optionsFromCapabilities.
 * @param capabilitiesUrl The URL to the capabilities file
 * @param config Any additional configuration we want when creating the source. Typically, this will be things like
 * Matrix Set or format. See {@link https://openlayers.org/en/latest/apidoc/module-ol_source_WMTS.html#.optionsFromCapabilities}
 * @param urlMapper A function converting the URL(s) reported by the capabilities to an array of other URLs. Typically,
 * this can be used if the server uses a scheme of multiple subdomain aliases to work around the browser limitation on
 * concurrent requests to the same domain, though this is less relevant in modern browsers.
 */
export function createWmtsSource(
  capabilitiesUrl: string,
  config: Partial<Options>,
  urlMapper?: (urls: string[]) => string[]
): Promise<WMTS> {
  return fetch(capabilitiesUrl)
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response;
    })
    .then((response) => response.text())
    .then((text) => {
      const capabilities = new WMTSCapabilities().read(text);
      const options = optionsFromCapabilities(capabilities, config);
      if (options) {
        if (!options.format) {
          options.format = 'image/png';
        }
        if (options.urls && urlMapper) {
          options.urls = urlMapper(options.urls);
        }
        return new WMTS(options);
      } else {
        throw new Error(
          'Layer "' + config.layer + '"not found incapabilities file'
        );
      }
    });
}
/**
 * Trivial wrapper around {@link createWmtsSource}, creating a TileLayer based on the WMTS Source. See that function
 * for a description of the parameters.
 */
export function createWmtsLayer(
  url: string,
  config: Partial<Options>,
  urlMapper?: (urls: string[]) => string[]
): Promise<TileLayer<WMTS>> {
  return createWmtsSource(url, config, urlMapper).then(
    (source) => new TileLayer({ source })
  );
}
