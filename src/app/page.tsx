export default function Home() {
  const colorsUsedInVSCODE = Object.entries(VESPER_PALETTE).reduce(
    (colorDictionary, [key, value]) => {
      colorDictionary[value] = [...(colorDictionary[value] || []), key];

      return colorDictionary;
    },
    {} as Record<string, string[]>
  );

  // console.log(

  // );

  // return (
  //   <div>
  //     {Object.keys(colorsUsedInVSCODE).map((color) => {
  //       return (
  //         <div key={color} className="flex gap-2 items-center">
  //           <div style={{ background: color }} className="w-4 h-4" />
  //           <div>{color}</div>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
  //
  // return (
  //   <div>
  //     {Object.entries(baseColors).map(([label, hex]) => {
  //       return (
  //         <div key={label} className="flex gap-2 items-center">
  //           <div style={{ background: hex }} className="w-4 h-4" />
  //           <div>
  //             {label} - {hex}
  //           </div>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );

  const opacity = opacityToHex(
    calculateOpacity(
      baseColors["backgound-base"],
      baseColors["foreground-base"],
      baseColors["foreground-subtle"]
    )
  );
  const color = `${baseColors["foreground-base"]}${opacity}`;
  // return color;
  return blendColors(color, baseColors["backgound-base"]);
}

const baseColors = {
  "backgound-base": "#101010",
  "background-subtle": "",

  "foreground-subtle": "#A0A0A0",
  "foreground-base": "#FFFFFF",
};

const VESPER_PALETTE = {
  "editor.background": "#101010",
  "editor.foreground": "#FFF",
  "editor.selectionBackground": "#FFFFFF25",
  "editorError.foreground": "#FF8080",
  "editorWarning.foreground": "#FFC799",
  "editorGutter.addedBackground": "#99FFE4",
  "editorBracketHighlight.foreground6": "#A0A0A0",

  "editorLineNumber.foreground": "#505050",
  "editorGutter.deletedBackground": "#FF8080",

  "editorInlayHint.foreground": "#A0A0A0",
  "editorInlayHint.background": "#1C1C1C",
  // Sidebar
  "sideBarTitle.foreground": "#A0A0A0",
  "sideBarSectionHeader.foreground": "#A0A0A0",
  // Activity bar
  "activityBar.foreground": "#A0A0A0",
  "activityBarBadge.foreground": "#000",
  // Title bar
  "titleBar.activeForeground": "#7E7E7E",
  "titleBar.inactiveForeground": "#707070",
  // Tab
  "tab.activeBackground": "#161616",
  // Status bar
  "statusBar.debuggingBackground": "#FF7300",
  "statusBar.foreground": "#A0A0A0",
  "statusBarItem.remoteForeground": "#000",
  // Change explorer active item color
  "list.inactiveSelectionBackground": "#232323",
  // Global
  "badge.foreground": "#000",
  "button.hoverBackground": "#FFCFA8",
  "button.foreground": "#000",
  "icon.foreground": "#A0A0A0",
  "input.background": "#1C1C1C",
  "list.activeSelectionBackground": "#232323",
  "list.hoverBackground": "#282828",
  "list.errorForeground": "#FF8080",
  "selection.background": "#666",
  // Brackets
  "editorBracketHighlight.foreground1": "#A0A0A0",
  "editorBracketHighlight.foreground2": "#A0A0A0",
  "editorBracketHighlight.foreground3": "#A0A0A0",
  "editorBracketHighlight.foreground4": "#A0A0A0",
  "editorBracketHighlight.foreground5": "#A0A0A0",
  "editorBracketHighlight.unexpectedBracket.foreground": "#FF8080",
  // Links
  "textLink.activeForeground": "#FFCFA8",
  // Tooltips
  "editorHoverWidget.background": "#161616",
  "editorHoverWidget.border": "#282828",
  // Scrollbar
  "scrollbarSlider.background": "#34343480",
  "scrollbarSlider.hoverBackground": "#343434",
};

// utils

function calculateOpacity(
  background: string,
  source: string,
  target: string
): number {
  // Convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const [bR, bG, bB] = hexToRgb(background);
  const [sR, sG, sB] = hexToRgb(source);
  const [tR, tG, tB] = hexToRgb(target);

  // Calculate opacity for each channel
  const calcOpacityChannel = (b: number, s: number, t: number): number => {
    if (s === t) return 1;
    return Math.max(0, Math.min(1, (t - b) / (s - b)));
  };

  const opacityR = calcOpacityChannel(bR, sR, tR);
  const opacityG = calcOpacityChannel(bG, sG, tG);
  const opacityB = calcOpacityChannel(bB, sB, tB);

  // Return the average opacity
  return (opacityR + opacityG + opacityB) / 3;
}

function opacityToHex(opacity: number): string {
  // Ensure opacity is between 0 and 1
  opacity = Math.max(0, Math.min(1, opacity));

  // Convert to 0-255 range and then to hex
  const alphaInt = Math.round(opacity * 255);
  const alphaHex = alphaInt.toString(16).padStart(2, "0");

  return alphaHex.toUpperCase();
}

function blendColors(foreground: string, background: string): string {
  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string): [number, number, number] => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  // Helper function to convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = Math.round(x).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  // Extract RGB and alpha values
  const [fR, fG, fB] = hexToRgb(foreground.slice(0, 7));
  const alpha = parseInt(foreground.slice(7), 16) / 255;
  // console.log(alpha);
  // console.log(foreground);
  const [bR, bG, bB] = hexToRgb(background);

  // Blend colors
  const blendChannel = (fC: number, bC: number) => {
    return Math.round(fC * alpha + bC * (1 - alpha));
  };

  const rBlend = blendChannel(fR, bR);
  const gBlend = blendChannel(fG, bG);
  const bBlend = blendChannel(fB, bB);

  // Convert back to hex
  return rgbToHex(rBlend, gBlend, bBlend);
}
