// The portrait is local and excluded from Git. Keep the layout intact if absent.
const portrait = document.querySelector('.profile-photo');
if (portrait) {
  const hideMissingPortrait = () => { portrait.parentElement.hidden = true; };
  portrait.addEventListener('error', hideMissingPortrait);
  if (portrait.complete && portrait.naturalWidth === 0) hideMissingPortrait();
}
