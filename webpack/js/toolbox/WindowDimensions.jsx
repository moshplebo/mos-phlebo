const WindowDimensions = () => {
  let w = window,
      d = document,
      documentElement = d.documentElement,
      body = d.getElementsByTagName('body')[0];

  let wWidth = w.innerWidth || documentElement.clientWidth || body.clientWidth;
  return {width: wWidth};
}

export default WindowDimensions;
