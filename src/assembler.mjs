export default class Assembler {
    constructor() {
        this.source = "";
        this.buffer = [];
        this.section_buffer = null;
        this.sub_section_buffer = null;
    }

    beginSection(s) {
        this.emit(s);
        this.emitComment("// section kind");
        this.section_buffer = [];
    }

    endSection() {
        let section_buffer = this.section_buffer;
        this.section_buffer = null;
        let length = 0;
        section_buffer.forEach((i) => { if (!i.comment) { ++length; } });
        this.emitLength(length);
        this.emitComment("// section length");
        this.emit(section_buffer)
    }

    beginSubSection() {
        this.sub_section_buffer = [];
    }

    endSubSection() {
        let sub_section_buffer = this.sub_section_buffer;
        this.sub_section_buffer = null;
        let length = 0;
        sub_section_buffer.forEach((i) => { if (!i.comment) { ++length; } });
        this.emitLength(length);
        this.emitComment("// sub-section length");
        this.emit(sub_section_buffer)
    }

    emitLength(l) {
        this.emit(l);
    }

    emit(v) {
        if (Array.isArray(v)) {
            v.forEach((e) => {
                this.emit(e);
            });
        } else if (typeof v === 'string') {
            this.emitLength(v.length);
            for (var i = 0; i < v.length; i++) {
                this.emit(v.charCodeAt(i));
            }
            this.emitComment("// string: " + "\"" + v + "\"");
        } else if (this.sub_section_buffer != null) {
            this.sub_section_buffer.push(v);
        } else if (this.section_buffer != null) {
            this.section_buffer.push(v);
        } else {
            if (typeof v === 'number') {
                if (Math.floor(v) != v) throw "can't emit non-integer";
                if (v < 0 || v > 255) throw "emit out of range";
                let s = v.toString(16);
                let hex = "0x" + ((v < 16) ? "0" : "") + s + ", ";
                this.buffer.push(v);
                this.source += hex;
            } else if (v.comment) {
                this.source += v.comment + "\n";
            } else {
                throw "ensupported emit type";
            }
        }
    }
    
    emitHeader() {
        this.emit([
            0x00, 0x61, 0x73, 0x6d
        ]);
        this.emitComment("// WASM_BINARY_MAGIC");
        this.emit([
            0x01, 0x00, 0x00, 0x00
        ]);
        this.emitComment("// WASM_BINARY_VERSION");
        }

   get_local(l) {
       this.emit(0x20);
       this.emitComment("// get_local");
       this.emit(l);
       this.emitComment("// local_index");
   }

   i32_add() {
       this.emit(0x6a);
       this.emitComment("// i32.add");
   }

   end() {
       this.emit(0x0b);
       this.emitComment("// end");
   }

   emitComment(c) {
       this.emit({
           comment: c
       });
   }

    getBytes() {
        const buffer = new ArrayBuffer(this.buffer.length);
        const byte_buffer = new Uint8Array(buffer);
        let next = 0;
        this.buffer.forEach((e) => {
            byte_buffer[next++] = e;
        });
        return buffer;
    }

    getSource() {
        return this.source;
    }
}
