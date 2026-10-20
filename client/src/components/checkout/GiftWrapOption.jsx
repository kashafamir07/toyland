import { Gift } from "lucide-react";

const RIBBON_COLORS = [
  { id: "coral", label: "Coral", hex: "#FF7A59" },
  { id: "mint", label: "Mint", hex: "#A8E6CF" },
  { id: "sky", label: "Sky Blue", hex: "#AEE1F9" },
  { id: "blush", label: "Blush Pink", hex: "#FFD6E0" },
];

export default function GiftWrapOption({ giftWrap, setGiftWrap, fee }) {
  return (
    <div className="rounded-2xl border-2 border-plum/10 p-4">
      <label className="flex items-center justify-between cursor-pointer">
        <span className="flex items-center gap-2 font-display font-bold text-sm text-plum">
          <Gift size={18} className="text-coral" /> Add Gift Wrapping (+Rs. {fee})
        </span>
        <input
          type="checkbox"
          checked={giftWrap.enabled}
          onChange={(e) => setGiftWrap({ ...giftWrap, enabled: e.target.checked })}
          className="w-5 h-5 rounded accent-coral cursor-pointer"
        />
      </label>

      {giftWrap.enabled && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-display font-bold text-plum/60 mb-2">Ribbon Color</p>
            <div className="flex gap-2">
              {RIBBON_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setGiftWrap({ ...giftWrap, ribbonColor: c.id })}
                  className={`w-9 h-9 rounded-full border-2 transition-transform ${
                    giftWrap.ribbonColor === c.id ? "border-plum scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.label}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-display font-bold text-plum/60 mb-1.5">Gift Message (optional)</p>
            <textarea
              rows={2}
              maxLength={150}
              value={giftWrap.message}
              onChange={(e) => setGiftWrap({ ...giftWrap, message: e.target.value })}
              placeholder="Happy Birthday! Love, ..."
              className="input"
            />
          </div>
        </div>
      )}
    </div>
  );
}