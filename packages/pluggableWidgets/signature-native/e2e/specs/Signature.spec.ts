import { expect, by, element } from "detox";
import { resetDevice, setText, tapMenuItem } from "../../../../../detox/src/helpers";

describe("Signature", () => {
    beforeEach(async () => {
        await tapMenuItem("Signature");
    });

    afterAll(async () => {
        await resetDevice();
    });

    it("should be able to draw", async () => {});

    it("should be saved", async () => {});

    it("should support custom styling", async () => {});
});
