import './SectionArtwork.css';

const artworkDetails = {
  dashboard: {
    label: 'A new day and a fresh start',
    title: 'Every day is a chance to rise.',
    description: 'Small steps. Steady growth. A future shaped with purpose.',
    scene: (
      <>
        <circle cx="690" cy="74" r="39" fill="#F3D98C" />
        <path d="M0 175 Q135 94 270 164 T540 148 T900 145 V230 H0Z" fill="#2E8880" />
        <path d="M0 194 Q155 128 315 187 T620 170 T900 177 V230 H0Z" fill="#075E60" />
        <path d="M475 190 Q555 120 635 190" fill="none" stroke="#E9D18A" strokeWidth="4" strokeLinecap="round" opacity=".85" />
        <path d="M610 188 Q690 111 770 188" fill="none" stroke="#E9D18A" strokeWidth="4" strokeLinecap="round" opacity=".55" />
      </>
    )
  },
  wellness: {
    label: 'A peaceful moment in nature',
    title: 'Make room to breathe.',
    description: 'Gentle practices for balance, calm, and wellbeing.',
    scene: (
      <>
        <circle cx="720" cy="62" r="31" fill="#F3D98C" />
        <path d="M475 170 Q565 95 650 160 T900 150 V230 H475Z" fill="#438F83" />
        <path d="M470 183 Q590 145 710 184 T900 176 V230 H470Z" fill="#B6D8C9" />
        <path d="M0 160 Q120 95 245 164 T470 155 V230 H0Z" fill="#26776F" />
        <path d="M0 190 Q140 150 270 190 T470 180 V230 H0Z" fill="#0B5C5D" />
        <circle cx="302" cy="117" r="13" fill="#D9A85B" />
        <path d="M302 133 L302 173 M302 145 L282 159 M302 145 L321 158" stroke="#F5E9C9" strokeWidth="8" strokeLinecap="round" />
        <path d="M288 174 Q302 163 316 174 L324 204 H280Z" fill="#E9C77B" />
        <path d="M260 204 H345" stroke="#E9D18A" strokeWidth="4" strokeLinecap="round" />
      </>
    )
  },
  community: {
    label: 'People coming together in support',
    title: 'We rise stronger together.',
    description: 'A place for encouragement, respect, and belonging.',
    scene: (
      <>
        <circle cx="675" cy="66" r="33" fill="#F3D98C" opacity=".95" />
        <path d="M500 190 Q620 122 740 184 T900 170 V230 H500Z" fill="#3A8C7F" />
        <path d="M0 205 Q130 156 260 202 T500 195 V230 H0Z" fill="#0B5C5D" />
        <circle cx="590" cy="100" r="19" fill="#D99A68" />
        <path d="M557 185 Q560 126 590 126 Q621 126 624 185Z" fill="#F0D58D" />
        <circle cx="665" cy="91" r="21" fill="#8E5E4C" />
        <path d="M628 185 Q632 119 665 119 Q700 119 703 185Z" fill="#E8F1E9" />
        <circle cx="740" cy="104" r="18" fill="#E6B88A" />
        <path d="M709 185 Q712 132 740 132 Q770 132 773 185Z" fill="#C69A4B" />
        <path d="M605 151 Q665 184 725 151" fill="none" stroke="#F7E9C7" strokeWidth="5" strokeLinecap="round" />
      </>
    )
  },
  academy: {
    label: 'An open book and a growing plant',
    title: 'Learn. Grow. Heal. Rise.',
    description: 'Build knowledge, strengthen skills, and shape your legacy.',
    scene: (
      <>
        <circle cx="735" cy="68" r="32" fill="#F3D98C" />
        <path d="M0 190 Q150 125 300 185 T570 178 V230 H0Z" fill="#2B8178" />
        <path d="M515 192 Q640 143 780 183 T900 174 V230 H515Z" fill="#0B5C5D" />
        <path d="M570 178 Q640 143 710 178 L710 212 Q640 180 570 212Z" fill="#FFF9E9" stroke="#C69A4B" strokeWidth="4" />
        <path d="M710 178 Q780 143 850 178 L850 212 Q780 180 710 212Z" fill="#F0E6CD" stroke="#C69A4B" strokeWidth="4" />
        <path d="M710 178 V211" stroke="#C69A4B" strokeWidth="3" />
        <path d="M710 172 V104" stroke="#E6D69C" strokeWidth="5" strokeLinecap="round" />
        <path d="M710 137 Q665 130 666 99 Q700 96 710 137Z" fill="#A9C9A4" />
        <path d="M710 120 Q716 82 753 83 Q754 116 710 120Z" fill="#75A98E" />
      </>
    )
  },
  safety: {
    label: 'A protective symbol in a calm landscape',
    title: 'Support is here when you need it.',
    description: 'Find trusted resources, practical tools, and a safer next step.',
    scene: (
      <>
        <circle cx="720" cy="65" r="34" fill="#F3D98C" />
        <path d="M0 185 Q145 118 290 184 T560 170 T900 177 V230 H0Z" fill="#438F83" />
        <path d="M0 205 Q160 157 310 204 T610 193 T900 196 V230 H0Z" fill="#0B5C5D" />
        <path d="M700 91 L748 108 V145 Q748 177 700 198 Q652 177 652 145 V108Z" fill="#F7F4E9" stroke="#C69A4B" strokeWidth="5" />
        <path d="M679 143 L694 158 L723 126" fill="none" stroke="#176C68" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )
  }
};

function SectionArtwork({ variant }) {
  const item = artworkDetails[variant];
  if (!item) return null;

  return (
    <figure className={`section-artwork section-artwork-${variant}`} role="img" aria-label={item.label}>
      <svg viewBox="0 0 900 230" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={`art-sky-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#073F43" />
            <stop offset="58%" stopColor="#147C78" />
            <stop offset="100%" stopColor="#D2B36C" />
          </linearGradient>
        </defs>
        <rect width="900" height="230" fill={`url(#art-sky-${variant})`} />
        {item.scene}
      </svg>
      <figcaption>
        <span>{item.title}</span>
        <small>{item.description}</small>
      </figcaption>
    </figure>
  );
}

export default SectionArtwork;
