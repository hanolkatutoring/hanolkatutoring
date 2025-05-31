import { supabase } from './auth.js';

export async function addXP(amount, type) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('user_xp').upsert(
        { user_id: user.id, xp: amount },
        { onConflict: ['user_id'], ignoreDuplicates: false }
    );

    await supabase.from('resource_progress').insert({
        user_id: user.id,
        resource_type: type,
        xp_awarded: amount,
        timestamp: new Date().toISOString()
    });

    updateXPDisplay(user.id);
}

export async function updateXPDisplay(userId) {
    const { data } = await supabase.from('user_xp').select('xp').eq('user_id', userId).single();
    const xpDisplay = document.getElementById('xp-display');
    if (data && xpDisplay) xpDisplay.textContent = `XP: ${data.xp}`;
}
