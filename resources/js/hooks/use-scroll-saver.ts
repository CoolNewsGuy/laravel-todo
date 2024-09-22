export function useScrollSaver() {
  return {
    /**
     * Save the current scroll position in local storage.
     */
    saveCurrentPosition() {
      const coords = { x: window.scrollX, y: window.scrollY };

      localStorage.setItem("position", JSON.stringify(coords));

      return coords;
    },

    /**
     * @param  scrollDirection default = `both`
     * @returns `Error` if no saved scroll position
     */
    scrollToSavedPosition(
      scrollDirection: "horizontal" | "vertical" | "both" = "both",
    ): Error | void {
      const savedCoords = this.getSavedScrollPosition();

      if (!savedCoords) {
        return new Error("No saved scroll position");
      }

      window.scrollTo({
        behavior: "instant",
        left: scrollDirection !== "vertical" ? savedCoords.x : undefined,
        top: scrollDirection !== "horizontal" ? savedCoords.y : undefined,
      });
    },

    getSavedScrollPosition() {
      const coords = localStorage.getItem("position");

      if (!coords) {
        return null;
      }

      const coordsObj = JSON.parse(coords);

      if (typeof coordsObj.x !== "number" || typeof coordsObj.y !== "number") {
        return null;
      }

      return coordsObj as { x: number; y: number };
    },
  };
}
