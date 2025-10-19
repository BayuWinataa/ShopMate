// src/app/api/addresses/[id]/route.js
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function PATCH(req, { params }) {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	let body;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const id = params.id;
	const patch = {};
	if (typeof body.label === 'string') patch.label = body.label;
	if (typeof body.recipient_name === 'string') patch.recipient_name = body.recipient_name;
	if (typeof body.phone === 'string') patch.phone = body.phone;
	if (typeof body.address === 'string') patch.address = body.address;
	if (typeof body.note === 'string' || body.note === null) patch.note = body.note;
	patch.updated_at = new Date().toISOString();

	const { data, error } = await supabase.from('addresses').update(patch).eq('id', id).select().single();
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ data });
}

export async function DELETE(_req, { params }) {
	const supabase = await createSupabaseServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const id = params.id;
	const { error } = await supabase.from('addresses').delete().eq('id', id);
	if (error) return NextResponse.json({ error: error.message }, { status: 500 });
	return NextResponse.json({ success: true });
}
