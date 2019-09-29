const Navbar = function() {
	const rootEl = document.getElementsByTagName('html')[0];
	const navbarBtn = document.getElementById('navbar-btn');

	rootEl.dataset.navbarExpanded = false;

	if (navbarBtn) {
		navbarBtn.addEventListener('click', () => {
			const navbarMode =
				rootEl.getAttribute('data-navbar-expanded') !== 'false'
					? 'false'
					: 'true';
			rootEl.setAttribute('data-navbar-expanded', navbarMode);
		});
	}
};

export default Navbar;
