import boom   from '@hapi/boom'
import config from '../configs/config'
import Sample from '../models/sample'

export async function create(req, res, next) {
  try {
    const data = req.body
    const result = await Sample.create(data)
    res.result = result
    next(res)
  } catch (error) { next(err) }
}

export function list(req, res, next) {
  try {
    const query = req.query
    const result = await Sample.list(query)
    res.result = result
    next(res)
  } catch (error) { next(err) }
}

export function details(req, res, next) {
  try {
    const sampleId = req.params.sampleId
    const result = await Sample.details(sampleId)
    res.result = result
    next(res)
  } catch (error) { next(err) }
}

export function update(req, res, next) {
  try {
    const sampleId = req.params.sampleId
    const result = await Sample.updateById(sampleId, req.body)
    res.result = result
    next(res)
  } catch (error) { next(err) }
}

export function remove(req, res, next) {
  try {
    const sampleId = req.params.sampleId
    const result = await Sample.remove(sampleId)
    res.result = result
    next(res)
  } catch (error) { next(err) }
}
