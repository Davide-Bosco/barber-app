import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseKey =
	process.env.SUPABASE_SERVICE_ROLE_KEY ??
	process.env.SUPABASE_SERVICE_KEY ??
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
	process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl) {
	throw new Error('Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL.')
}

if (!supabaseKey) {
	throw new Error('Missing Supabase key. Set SUPABASE_SERVICE_ROLE_KEY or a public Supabase key.')
}

const supabase = createClient(supabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''), supabaseKey, {
	auth: {
		persistSession: false,
		autoRefreshToken: false,
	},
})

export async function GET() {
	const { data, error } = await supabase.from('barbers').select('id, name, service_price').order('id')

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
	const body = await request.json().catch(() => null)
	const name = typeof body?.name === 'string' ? body.name.trim() : ''
	const servicePrice = Number(body?.service_price)

	if (!name || Number.isNaN(servicePrice)) {
		return NextResponse.json({ error: 'Nome e prezzo validi sono obbligatori.' }, { status: 400 })
	}

	const { error } = await supabase.from('barbers').insert([{ name, service_price: servicePrice }])

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
	const idParam = request.nextUrl.searchParams.get('id')
	const id = Number(idParam)

	if (!idParam || Number.isNaN(id)) {
		return NextResponse.json({ error: 'Id non valido.' }, { status: 400 })
	}

	const { error } = await supabase.from('barbers').delete().eq('id', id)

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json({ ok: true })
}