///<reference path="../_definitions.ts"/>

module away.textures
{
	//import flash.base.*;
	//import flash.gl.textures.CubeTexture;
	//import flash.gl.textures.Texture;
	//import flash.gl.textures.TextureBase;
	//import flash.geom.*;

	/**
	 * MipmapGenerator is a helper class that uploads BitmapData to a Texture including mipmap levels.
	 */
	export class MipmapGenerator
	{
		private static _matrix:away.geom.Matrix = new away.geom.Matrix();
		private static _rect:away.geom.Rectangle = new away.geom.Rectangle();
		private static _source:away.base.BitmapData;//= new away.base.BitmapData();

		/**
		 * Uploads a BitmapData with mip maps to a target Texture object.
		 * @param source
		 * @param target The target Texture to upload to.
		 * @param mipmap An optional mip map holder to avoids creating new instances for fe animated materials.
		 * @param alpha Indicate whether or not the uploaded bitmapData is transparent.
		 */
		public static generateHTMLImageElementMipMaps(source:HTMLImageElement, target:away.gl.TextureBase, mipmap:away.base.BitmapData = null, alpha:boolean = false, side:number = -1)
		{
			MipmapGenerator._rect.width = source.width;
			MipmapGenerator._rect.height = source.height;

			MipmapGenerator._source = new away.base.BitmapData(source.width, source.height, alpha);
			MipmapGenerator._source.drawImage(source, MipmapGenerator._rect, MipmapGenerator._rect);

			MipmapGenerator.generateMipMaps(MipmapGenerator._source, target, mipmap);

			MipmapGenerator._source.dispose();
			MipmapGenerator._source = null;
		}

		/**
		 * Uploads a BitmapData with mip maps to a target Texture object.
		 * @param source The source BitmapData to upload.
		 * @param target The target Texture to upload to.
		 * @param mipmap An optional mip map holder to avoids creating new instances for fe animated materials.
		 * @param alpha Indicate whether or not the uploaded bitmapData is transparent.
		 */
		public static generateMipMaps(source:away.base.BitmapData, target:away.gl.TextureBase, mipmap:away.base.BitmapData = null, alpha:boolean = false, side:number = -1)
		{
			var w:number = source.width;
			var h:number = source.height;
			var regen:boolean = mipmap != null;
			var i:number = 0;

			if (!mipmap)
				mipmap = new away.base.BitmapData(w, h, alpha);

			MipmapGenerator._rect.width = w;
			MipmapGenerator._rect.height = h;

			while (w >= 1 || h >= 1) {

				if (alpha)
					mipmap.fillRect(MipmapGenerator._rect, 0);

				MipmapGenerator._matrix.a = MipmapGenerator._rect.width/source.width;
				MipmapGenerator._matrix.d = MipmapGenerator._rect.height/source.height;

				mipmap.width = MipmapGenerator._rect.width;
				mipmap.height = MipmapGenerator._rect.height;
				mipmap.copyPixels(source, source.rect, MipmapGenerator._rect);

				if (target instanceof away.gl.Texture)
					(<away.gl.Texture> target).uploadFromBitmapData(mipmap, i++);
				else
					(<away.gl.CubeTexture> target).uploadFromBitmapData(mipmap, side, i++);

				w >>= 1;
				h >>= 1;

				MipmapGenerator._rect.width = w > 1? w : 1;
				MipmapGenerator._rect.height = h > 1? h : 1;
			}

			if (!regen)
				mipmap.dispose();
		}
	}
}
