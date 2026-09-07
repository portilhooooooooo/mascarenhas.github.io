import {createRoot, type Root} from 'react-dom/client';
import {CarteiraProcessualPage} from './CarteiraProcessualPage';
const node=document.getElementById('dashboard-root');
let root:Root|null=null;
function sync(){
 const user=window.MBA_CURRENT_USER;
 const allowed=Boolean(user && user.access_kind==='administrative' && user.permissions['dashboard.view'] && document.getElementById('dashboard')?.classList.contains('active'));
 if(!allowed){root?.unmount();root=null;return;}
 if(node && !root){root=createRoot(node);root.render(<CarteiraProcessualPage/>);}
}
window.addEventListener('mba:authenticated',sync);
window.addEventListener('mba:page-changed',sync);
window.addEventListener('mba:session-ended',()=>{root?.unmount();root=null;});
sync();
